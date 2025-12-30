

from django.db import models
from decimal import Decimal

class Proveedor(models.Model):
        nombre = models.CharField(max_length=200)
        rut = models.CharField(max_length=20, unique=True)
        email = models.EmailField()
        telefono = models.CharField(max_length=20, blank=True)
        direccion = models.CharField(max_length=255, blank=True)
        def __str__(self):
                return self.nombre

class OrdenCompra(models.Model):
        proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
        fecha = models.DateField(auto_now_add=True)
        total = models.DecimalField(max_digits=12, decimal_places=2)
        estado = models.CharField(max_length=50, default="pendiente")
        observaciones = models.TextField(blank=True)
        def __str__(self):
                return f"OC {self.id} - {self.proveedor.nombre}"

class DocumentoCompraInternacional(models.Model):
        TIPO_DOCUMENTO_CHOICES = [
                ('factura', 'Factura'),
                ('boleta', 'Boleta'),
        ]
        
        MONEDA_CHOICES = [
                ('USD', 'Dólar Estadounidense'),
                ('EUR', 'Euro'),
                ('CLP', 'Peso Chileno'),
                ('ARS', 'Peso Argentino'),
                ('BRL', 'Real Brasileño'),
        ]
        
        orden_compra = models.ForeignKey(OrdenCompra, on_delete=models.CASCADE, related_name='documentos_internacionales', null=True, blank=True)
        proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
        tipo_documento = models.CharField(max_length=10, choices=TIPO_DOCUMENTO_CHOICES)
        numero_documento = models.CharField(max_length=50)
        fecha = models.DateField(auto_now_add=True)
        moneda = models.CharField(max_length=3, choices=MONEDA_CHOICES, default='USD')
        tipo_cambio = models.DecimalField(max_digits=10, decimal_places=4, help_text='Tipo de cambio a moneda local')
        monto_neto = models.DecimalField(max_digits=12, decimal_places=2, help_text='Monto sin IVA')
        iva_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=19.00, help_text='Porcentaje de IVA')
        monto_iva = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
        monto_total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
        monto_total_local = models.DecimalField(max_digits=12, decimal_places=2, editable=False, help_text='Total en moneda local')
        descripcion = models.TextField(blank=True)
        
        def save(self, *args, **kwargs):
                self.monto_iva = (self.monto_neto * self.iva_porcentaje / Decimal('100')).quantize(Decimal('0.01'))
                self.monto_total = self.monto_neto + self.monto_iva
                self.monto_total_local = (self.monto_total * self.tipo_cambio).quantize(Decimal('0.01'))
                super().save(*args, **kwargs)
        
        def __str__(self):
                return f"{self.get_tipo_documento_display()} {self.numero_documento} - {self.proveedor.nombre}"
        
        class Meta:
                verbose_name = "Documento de Compra Internacional"
                verbose_name_plural = "Documentos de Compra Internacional"
                ordering = ['-fecha']

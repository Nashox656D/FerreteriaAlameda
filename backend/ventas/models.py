

from django.db import models
from django.contrib.auth.models import User

class Cliente(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
        nombre = models.CharField(max_length=200)
        rut = models.CharField(max_length=20, unique=True)
        email = models.EmailField()
        telefono = models.CharField(max_length=20, blank=True)
        direccion = models.CharField(max_length=255, blank=True)
        def __str__(self):
                return self.nombre

class Cotizacion(models.Model):
        from rrhh.models import Empleado
        
        cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, null=True, blank=True)
        empleado = models.ForeignKey('rrhh.Empleado', on_delete=models.CASCADE, null=True, blank=True, related_name='cotizaciones_nomina')
        fecha = models.DateField(auto_now_add=True)
        fecha_vencimiento = models.DateField(null=True, blank=True)
        total = models.DecimalField(max_digits=12, decimal_places=2)
        estado = models.CharField(max_length=50, default="pendiente")
        pagada = models.BooleanField(default=False)
        observaciones = models.TextField(blank=True)
        sueldo_bruto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
        afp_descuento = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
        salud_descuento = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
        total_neto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
        
        def save(self, *args, **kwargs):
                if self.sueldo_bruto:
                        from decimal import Decimal, ROUND_HALF_UP
                        sueldo = Decimal(str(self.sueldo_bruto))
                        self.afp_descuento = (sueldo * Decimal('0.10')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                        self.salud_descuento = (sueldo * Decimal('0.07')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                        self.total_neto = (sueldo - self.afp_descuento - self.salud_descuento).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                super().save(*args, **kwargs)
        
        def __str__(self):
                if self.cliente:
                        return f"Cotización {self.id} - {self.cliente.nombre}"
                elif self.empleado:
                        return f"Cotización Nómina {self.id} - {self.empleado.nombre}"
                return f"Cotización {self.id}"

class Pedido(models.Model):
        ESTADO_CHOICES = [
                ('PENDIENTE', 'Pendiente'),
                ('PROCESADO', 'Procesado'),
                ('CANCELADO', 'Cancelado'),
        ]
        
        cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
        fecha = models.DateTimeField(auto_now_add=True)
        total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
        estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
        observaciones = models.TextField(blank=True)
        
        def __str__(self):
                return f"Pedido {self.id} - {self.cliente.nombre} - ${self.total}"

class DetallePedido(models.Model):
        pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
        producto = models.ForeignKey('inventario.Producto', on_delete=models.CASCADE)
        cantidad = models.PositiveIntegerField()
        precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
        subtotal = models.DecimalField(max_digits=12, decimal_places=2)
        
        def save(self, *args, **kwargs):
                from decimal import Decimal
                self.subtotal = Decimal(str(self.precio_unitario)) * Decimal(str(self.cantidad))
                super().save(*args, **kwargs)
        
        def __str__(self):
                return f"{self.producto.nombre} x {self.cantidad}"

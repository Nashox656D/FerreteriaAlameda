

from django.db import models


class Factura(models.Model):
        numero = models.CharField(max_length=50, unique=True)
        fecha = models.DateField()
        fecha_vencimiento = models.DateField(null=True, blank=True)
        # Relacionar cliente con el modelo Cliente de la app ventas
        cliente = models.ForeignKey('ventas.Cliente', on_delete=models.SET_NULL, null=True, blank=True, related_name='facturas')
        pagada = models.BooleanField(default=False)

        @property
        def monto(self):
                # Sumar los subtotales de las líneas de la factura
                total = sum([linea.subtotal for linea in self.lineas.all()])
                return total

        def __str__(self):
                return f"Factura {self.numero}"


class LineaFactura(models.Model):
        factura = models.ForeignKey(Factura, on_delete=models.CASCADE, related_name='lineas')
        producto = models.ForeignKey('inventario.Producto', on_delete=models.SET_NULL, null=True, blank=True)
        descripcion = models.CharField(max_length=255, blank=True)
        cantidad = models.PositiveIntegerField(default=1)
        precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
        subtotal = models.DecimalField(max_digits=14, decimal_places=2)

        def save(self, *args, **kwargs):
                # calcular subtotal automáticamente
                from decimal import Decimal
                self.subtotal = (Decimal(str(self.precio_unitario)) * Decimal(str(self.cantidad)))
                super().save(*args, **kwargs)

        def __str__(self):
                return f"{self.producto} x {self.cantidad} ({self.subtotal})"


class Comision(models.Model):
        vendedor = models.CharField(max_length=200)
        monto = models.DecimalField(max_digits=10, decimal_places=2)
        fecha = models.DateField()
        pagada = models.BooleanField(default=False)

        def __str__(self):
                return f"Comisión {self.vendedor} - {self.monto}"

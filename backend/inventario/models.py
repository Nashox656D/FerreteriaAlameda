

from django.db import models

class Producto(models.Model):
	sku = models.CharField(max_length=50, unique=True)
	nombre = models.CharField(max_length=200)
	marca = models.CharField(max_length=100, blank=True, default='')
	descripcion = models.TextField(blank=True)
	categoria = models.CharField(max_length=100)
	precio = models.DecimalField(max_digits=10, decimal_places=2)
	activo = models.BooleanField(default=True)
	def __str__(self):
		return f"{self.sku} - {self.nombre} ({self.marca})" if self.marca else f"{self.sku} - {self.nombre}"

class Stock(models.Model):
	ESTADO_CHOICES = [
		('apto', 'Apto para venta'),
		('defectuoso', 'Defectuoso'),
		('cuarentena', 'En cuarentena'),
		('reclamo', 'En reclamo a proveedor'),
		('dado_baja', 'Dado de baja'),
	]
	
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
	cantidad = models.PositiveIntegerField(default=0)
	ubicacion = models.CharField(max_length=100, blank=True)
	estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='apto')
	
	# Auditoría de defectos
	motivo_defecto = models.CharField(max_length=255, blank=True)
	fecha_defecto = models.DateTimeField(null=True, blank=True)
	usuario_reporte = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
	
	class Meta:
		ordering = ['producto__nombre']
	
	def __str__(self):
		return f"{self.producto.sku} ({self.cantidad}) - {self.get_estado_display()}"


class MovimientoStock(models.Model):
	TIPO_CHOICES = [
		('agregar', 'Agregar'),
		('restar', 'Restar'),
		('venta', 'Venta'),
		('producto_creado', 'Producto Creado'),
		('producto_eliminado', 'Producto Eliminado'),
		('cambio_estado', 'Cambio de estado'),
		('reclamo_proveedor', 'Reclamo a proveedor'),
		('dado_baja', 'Dado de baja'),
		('devolucion', 'Devolución recibida'),
	]
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
	stock = models.ForeignKey(Stock, on_delete=models.SET_NULL, null=True, blank=True)
	tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
	cantidad = models.IntegerField(default=0)
	usuario = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
	nota = models.TextField(blank=True)
	creado = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-creado']

	def __str__(self):
		return f"{self.get_tipo_display()} - {self.producto.sku} ({self.cantidad}) @ {self.creado.strftime('%Y-%m-%d %H:%M:%S')}"


class ImagenProducto(models.Model):
	producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
	imagen = models.ImageField(upload_to='productos/')
	titulo = models.CharField(max_length=200, blank=True)
	es_principal = models.BooleanField(default=False)
	creado = models.DateTimeField(auto_now_add=True)
	
	class Meta:
		ordering = ['-es_principal', '-creado']
	
	def __str__(self):
		return f"Imagen - {self.producto.sku}"

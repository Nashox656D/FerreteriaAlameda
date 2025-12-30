


from django.db import models
from django.contrib.auth.models import User


class Empleado(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
        nombre = models.CharField(max_length=200)
        rut = models.CharField(max_length=20, unique=True)
        cargo = models.CharField(max_length=100)
        email = models.EmailField()
        fecha_ingreso = models.DateField()
        activo = models.BooleanField(default=True)
        def __str__(self):
                return self.nombre

class Vacaciones(models.Model):
        ESTADO_CHOICES = [
                ('PENDIENTE', 'Pendiente'),
                ('APROBADA', 'Aprobada'),
                ('RECHAZADA', 'Rechazada'),
        ]
        
        empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
        fecha_inicio = models.DateField()
        fecha_fin = models.DateField()
        aprobada = models.BooleanField(default=False)
        estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
        comentario_admin = models.TextField(blank=True, null=True)
        aprobada_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='vacaciones_aprobadas')
        fecha_respuesta = models.DateTimeField(null=True, blank=True)
        
        def __str__(self):
                return f"Vacaciones {self.empleado.nombre} ({self.fecha_inicio} - {self.fecha_fin}) - {self.estado}"

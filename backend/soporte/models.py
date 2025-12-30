

from django.db import models
from django.contrib.auth.models import User

class Ticket(models.Model):
        titulo = models.CharField(max_length=200)
        descripcion = models.TextField()
        fecha_creacion = models.DateTimeField(auto_now_add=True)
        estado = models.CharField(max_length=50, default="abierto")
        asignado_a = models.CharField(max_length=200, blank=True)
        creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets_creados')
        cliente = models.ForeignKey('ventas.Cliente', on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
        empleado = models.ForeignKey('rrhh.Empleado', on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
        
        def __str__(self):
                return f"Ticket {self.id} - {self.titulo}"

class Instalacion(models.Model):
        ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
        direccion = models.CharField(max_length=255)
        fecha_programada = models.DateField()
        realizada = models.BooleanField(default=False)
        def __str__(self):
                return f"Instalación {self.id} - {self.direccion}"

class SolicitudRecuperacion(models.Model):
        ESTADO_CHOICES = [
                ('PENDIENTE', 'Pendiente'),
                ('APROBADA', 'Aprobada'),
                ('RECHAZADA', 'Rechazada'),
        ]
        
        username = models.CharField(max_length=150)
        user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='solicitudes_recuperacion')
        estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
        fecha_solicitud = models.DateTimeField(auto_now_add=True)
        fecha_respuesta = models.DateTimeField(null=True, blank=True)
        atendida_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='recuperaciones_atendidas')
        
        def __str__(self):
                return f"Recuperación {self.username} - {self.estado}"

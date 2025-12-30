from django.contrib import admin
from .models import Ticket, Instalacion, SolicitudRecuperacion

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'fecha_creacion', 'estado', 'asignado_a')
    list_filter = ('estado', 'fecha_creacion')
    search_fields = ('titulo', 'descripcion', 'asignado_a')

@admin.register(Instalacion)
class InstalacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'direccion', 'fecha_programada', 'realizada')
    list_filter = ('realizada', 'fecha_programada')
    search_fields = ('direccion', 'ticket__titulo')

@admin.register(SolicitudRecuperacion)
class SolicitudRecuperacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'user', 'estado', 'fecha_solicitud', 'atendida_por')
    list_filter = ('estado', 'fecha_solicitud')
    search_fields = ('username', 'user__username')
    readonly_fields = ('fecha_solicitud', 'fecha_respuesta')

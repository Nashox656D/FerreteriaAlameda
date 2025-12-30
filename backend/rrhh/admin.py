from django.contrib import admin
from .models import Empleado, Vacaciones

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'rut', 'cargo', 'email', 'fecha_ingreso', 'activo')
    list_filter = ('cargo', 'activo', 'fecha_ingreso')
    search_fields = ('nombre', 'rut', 'email')
    readonly_fields = ('user',)

@admin.register(Vacaciones)
class VacacionesAdmin(admin.ModelAdmin):
    list_display = ('id', 'empleado', 'fecha_inicio', 'fecha_fin', 'estado', 'aprobada_por', 'fecha_respuesta')
    list_filter = ('estado', 'fecha_inicio', 'fecha_fin')
    search_fields = ('empleado__nombre',)
    readonly_fields = ('aprobada_por', 'fecha_respuesta')

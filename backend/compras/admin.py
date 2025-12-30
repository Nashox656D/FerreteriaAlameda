from django.contrib import admin
from .models import Proveedor, OrdenCompra, DocumentoCompraInternacional

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'rut', 'email', 'telefono')
    search_fields = ('nombre', 'rut', 'email')

@admin.register(OrdenCompra)
class OrdenCompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'proveedor', 'fecha', 'total', 'estado')
    list_filter = ('estado', 'fecha')
    search_fields = ('proveedor__nombre',)

@admin.register(DocumentoCompraInternacional)
class DocumentoCompraInternacionalAdmin(admin.ModelAdmin):
    list_display = ('numero_documento', 'tipo_documento', 'proveedor', 'fecha', 'moneda', 'monto_neto', 'monto_iva', 'monto_total', 'monto_total_local')
    list_filter = ('tipo_documento', 'moneda', 'fecha')
    search_fields = ('numero_documento', 'proveedor__nombre')
    readonly_fields = ('monto_iva', 'monto_total', 'monto_total_local')

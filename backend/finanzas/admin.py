from django.contrib import admin
from .models import Factura, Comision, LineaFactura


class LineaFacturaInline(admin.TabularInline):
    model = LineaFactura
    extra = 0
    readonly_fields = ('subtotal',)


@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ('id', 'numero', 'get_cliente_nombre', 'fecha', 'monto', 'pagada', 'fecha_vencimiento')
    list_filter = ('pagada', 'fecha', 'fecha_vencimiento')
    search_fields = ('numero', 'cliente__nombre')
    inlines = [LineaFacturaInline]

    def get_cliente_nombre(self, obj):
        return obj.cliente.nombre if obj.cliente else 'Consumidor'
    get_cliente_nombre.short_description = 'Cliente'


@admin.register(Comision)
class ComisionAdmin(admin.ModelAdmin):
    list_display = ('id', 'vendedor', 'monto', 'fecha', 'pagada')
    list_filter = ('pagada', 'fecha')
    search_fields = ('vendedor',)

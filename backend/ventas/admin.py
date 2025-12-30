from django.contrib import admin
from .models import Cliente, Cotizacion, Pedido, DetallePedido

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'rut', 'email', 'telefono', 'direccion')
    search_fields = ('nombre', 'rut', 'email')

@admin.register(Cotizacion)
class CotizacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_cliente_empleado', 'fecha', 'total', 'estado', 'pagada')
    list_filter = ('estado', 'pagada', 'fecha')
    search_fields = ('cliente__nombre', 'empleado__nombre')
    
    def get_cliente_empleado(self, obj):
        if obj.cliente:
            return f"Cliente: {obj.cliente.nombre}"
        elif obj.empleado:
            return f"Empleado: {obj.empleado.nombre}"
        return "N/A"
    get_cliente_empleado.short_description = 'Cliente/Empleado'

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha', 'total', 'estado')
    list_filter = ('estado', 'fecha')
    search_fields = ('cliente__nombre', 'cliente__rut')

@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'pedido', 'producto', 'cantidad', 'precio_unitario', 'subtotal')
    search_fields = ('pedido__id', 'producto__nombre')

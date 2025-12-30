from django.contrib import admin
from .models import Producto, Stock, MovimientoStock, ImagenProducto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'sku', 'nombre', 'precio', 'categoria')
    list_filter = ('categoria',)
    search_fields = ('sku', 'nombre', 'categoria')

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('id', 'producto', 'cantidad', 'estado', 'ubicacion', 'fecha_defecto')
    list_filter = ('estado', 'ubicacion')
    search_fields = ('producto__nombre', 'producto__sku', 'motivo_defecto')
    readonly_fields = ('fecha_defecto', 'usuario_reporte')


@admin.register(MovimientoStock)
class MovimientoStockAdmin(admin.ModelAdmin):
    list_display = ('id', 'producto', 'tipo', 'cantidad', 'usuario', 'creado')
    list_filter = ('tipo', 'usuario')
    search_fields = ('producto__sku', 'producto__nombre', 'nota')
    readonly_fields = ('creado',)


@admin.register(ImagenProducto)
class ImagenProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'producto', 'titulo', 'es_principal', 'creado')
    list_filter = ('es_principal', 'creado')
    search_fields = ('producto__sku', 'producto__nombre', 'titulo')
    readonly_fields = ('creado',)

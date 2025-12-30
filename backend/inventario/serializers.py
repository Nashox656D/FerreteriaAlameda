from rest_framework import serializers
from .models import Producto, Stock, MovimientoStock, ImagenProducto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = '__all__'


class ProductoDetalladoSerializer(serializers.ModelSerializer):
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_sku = serializers.CharField(source='producto.sku', read_only=True)
    usuario_reporte_nombre = serializers.CharField(source='usuario_reporte.username', read_only=True)
    
    class Meta:
        model = Stock
        fields = '__all__'


class MovimientoStockSerializer(serializers.ModelSerializer):
    producto_sku = serializers.CharField(source='producto.sku', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = MovimientoStock
        fields = '__all__'

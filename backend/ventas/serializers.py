from rest_framework import serializers
from .models import Cliente, Cotizacion, Pedido, DetallePedido

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class CotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.SerializerMethodField()
    cliente_rut = serializers.SerializerMethodField()
    empleado_nombre = serializers.SerializerMethodField()
    empleado_rut = serializers.SerializerMethodField()
    
    def get_cliente_nombre(self, obj):
        return obj.cliente.nombre if obj.cliente else None
    
    def get_cliente_rut(self, obj):
        return obj.cliente.rut if obj.cliente else None
    
    def get_empleado_nombre(self, obj):
        return obj.empleado.nombre if obj.empleado else None
    
    def get_empleado_rut(self, obj):
        return obj.empleado.rut if obj.empleado else None
    
    class Meta:
        model = Cotizacion
        fields = '__all__'
        extra_kwargs = {
            'cliente': {'required': False},
            'empleado': {'required': False}
        }

class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.SerializerMethodField()
    producto_sku = serializers.SerializerMethodField()
    
    def get_producto_nombre(self, obj):
        return obj.producto.nombre if obj.producto else None
    
    def get_producto_sku(self, obj):
        return obj.producto.sku if obj.producto else None
    
    class Meta:
        model = DetallePedido
        fields = '__all__'
        read_only_fields = ['subtotal']

class PedidoSerializer(serializers.ModelSerializer):
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    cliente_nombre = serializers.SerializerMethodField()
    cliente_rut = serializers.SerializerMethodField()
    
    def get_cliente_nombre(self, obj):
        return obj.cliente.nombre if obj.cliente else None
    
    def get_cliente_rut(self, obj):
        return obj.cliente.rut if obj.cliente else None
    
    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ['total', 'fecha']

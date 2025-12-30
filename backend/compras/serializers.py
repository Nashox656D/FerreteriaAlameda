from rest_framework import serializers
from .models import Proveedor, OrdenCompra, DocumentoCompraInternacional

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class OrdenCompraSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    proveedor_rut = serializers.CharField(source='proveedor.rut', read_only=True)
    
    class Meta:
        model = OrdenCompra
        fields = '__all__'

class DocumentoCompraInternacionalSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    tipo_documento_display = serializers.CharField(source='get_tipo_documento_display', read_only=True)
    moneda_display = serializers.CharField(source='get_moneda_display', read_only=True)
    
    class Meta:
        model = DocumentoCompraInternacional
        fields = '__all__'
        read_only_fields = ('monto_iva', 'monto_total', 'monto_total_local')

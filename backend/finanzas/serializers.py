from rest_framework import serializers
from .models import Factura, Comision, LineaFactura
from ventas.serializers import ClienteSerializer
from ventas.models import Cliente


class LineaFacturaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = LineaFactura
        fields = ['id', 'producto', 'producto_nombre', 'descripcion', 'cantidad', 'precio_unitario', 'subtotal']


class FacturaSerializer(serializers.ModelSerializer):
    lineas = LineaFacturaSerializer(many=True)
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), allow_null=True, required=False)
    cliente_detalle = ClienteSerializer(source='cliente', read_only=True)
    monto = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)

    class Meta:
        model = Factura
        fields = ['id', 'numero', 'fecha', 'fecha_vencimiento', 'cliente', 'cliente_detalle', 'pagada', 'monto', 'lineas']

    def create(self, validated_data):
        lineas_data = validated_data.pop('lineas', [])
        factura = Factura.objects.create(**validated_data)
        for linea in lineas_data:
            LineaFactura.objects.create(factura=factura, **linea)
        return factura

    def update(self, instance, validated_data):
        lineas_data = validated_data.pop('lineas', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if lineas_data is not None:
            # reemplazar líneas existentes
            instance.lineas.all().delete()
            for linea in lineas_data:
                LineaFactura.objects.create(factura=instance, **linea)
        return instance


class ComisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comision
        fields = '__all__'

from rest_framework.permissions import BasePermission, SAFE_METHODS


def _user_is_empleado(user):
    """Return True when user is linked to an Empleado with cargo 'Empleado'."""
    try:
        from rrhh.models import Empleado
        emp = Empleado.objects.filter(user=user).first()
        return emp is not None and emp.cargo == 'Empleado'
    except Exception:
        return False


class IsEmpleadoReadOnly(BasePermission):
    """Custom permission: users with cargo 'Empleado' may only perform safe methods.

    - If user is superuser, allow everything.
    - If user is an Empleado with cargo 'Empleado', allow only SAFE_METHODS (GET, HEAD, OPTIONS).
    - Other users: allow and defer to other permission checks.
    """

    def has_permission(self, request, view):
        # Superusers bypass this restriction
        if request.user and request.user.is_superuser:
            return True

        # If user is an Empleado with cargo 'Empleado', only safe methods allowed
        if request.user and request.user.is_authenticated and _user_is_empleado(request.user):
            return request.method in SAFE_METHODS

        # For all other users, do not block here (allow and let other permissions decide)
        return True

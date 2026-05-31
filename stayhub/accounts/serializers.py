from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    User,
    Property,
    Room,
    Booking,
    Payment,
    PropertyImage,
    RoomImage
)

# =========================
# AUTH
# =========================

class RegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    role = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "CUSTOMER")
        )


class CustomTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = user.role
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["role"] = self.user.role
        data["username"] = self.user.username

        return data


# =========================
# IMAGES
# =========================

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image"]


class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ["id", "image"]


# =========================
# PROPERTY
# =========================

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "name",
            "property_type",
            "address",
            "city",
            "description",
            "amenities",
            "status",
            "created_at",
            "images",
            "is_available"
        ]

    def get_is_available(self, obj):
        return obj.rooms.filter(is_available=True).exists()


# =========================
# ROOM
# =========================

class RoomSerializer(serializers.ModelSerializer):

    price = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_units = serializers.IntegerField()
    available_units = serializers.IntegerField()

    images = RoomImageSerializer(many=True, read_only=True)
    is_available = serializers.ReadOnlyField()

    class Meta:
        model = Room
        fields = [
            "id",
            "property",
            "room_type",
            "price",
            "total_units",
            "available_units",
            "is_available",
            "created_at",
            "images"
        ]


# =========================
# BOOKING
# =========================

# =========================
# BOOKING
# =========================

class BookingSerializer(serializers.ModelSerializer):

    # ✅ correct field (auto converts id → Room object)
    room = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all()
    )

    quantity = serializers.IntegerField(required=True)
    check_in = serializers.DateField(required=True)
    check_out = serializers.DateField(required=True)

    class Meta:
        model = Booking
        fields = [
            "room",
            "quantity",
            "check_in",
            "check_out"
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero"
            )
        return value

    def validate(self, data):
        if data["check_out"] <= data["check_in"]:
            raise serializers.ValidationError(
                "Check-out must be after check-in"
            )
        return data

# =========================
# CUSTOMER BOOKINGS VIEW
# =========================

class MyBookingSerializer(serializers.ModelSerializer):

    property_name = serializers.CharField(
        source="property.name",
        read_only=True
    )

    room_type = serializers.CharField(
        source="room.room_type",
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "property_name",
            "room_type",
            "check_in",
            "check_out",
            "quantity",
            "status",
            "total_price",
            "created_at"
        ]


# =========================
# VENDOR BOOKINGS VIEW
# =========================

class VendorBookingViewSerializer(serializers.ModelSerializer):

    customer = serializers.CharField(
        source="user.username",
        read_only=True
    )

    property_name = serializers.CharField(
        source="property.name",
        read_only=True
    )

    room_type = serializers.CharField(
        source="room.room_type",
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "customer",
            "property_name",
            "room_type",
            "check_in",
            "check_out",
            "quantity",
            "status",
            "total_price",
            "created_at"
        ]


# =========================
# PAYMENT
# =========================

class PaymentSerializer(serializers.ModelSerializer):

    amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Payment
        fields = [
            "id",
            "booking",
            "amount",
            "status",
            "provider",
            "provider_payment_id",
            "created_at"
        ]


class RegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role", "phone")

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data.get("role", "CUSTOMER")
        )

        # 🔥 update profile
        user.profile.phone = phone
        user.profile.save()

        return user
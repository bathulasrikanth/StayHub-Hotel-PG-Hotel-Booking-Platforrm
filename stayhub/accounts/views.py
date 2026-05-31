from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import status,permissions
from .serializers import RegisterSerializers,PropertySerializer,RoomSerializer,BookingSerializer,MyBookingSerializer,VendorBookingViewSerializer
from .models import Property,Room,Booking,Payment,PropertyImage
from .permissions import IsVendor,IsCustomer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Sum
from django.db import transaction
from rest_framework.generics import RetrieveAPIView
from .models import Property
from .serializers import PropertySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenSerializer
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import RoomImage




class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

class RegisterAPIView(APIView):
    def post(self,request):
        serializer = RegisterSerializers(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message" : "user register successfull"},
                status = status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
    
class VendorPropertyAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsVendor]

    def get(self, request):
        properties = Property.objects.filter(owner=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  # owner set here
            return Response(
                {"message": "Property submitted for approval"},
                status=status.HTTP_201_CREATED
            )
        print("DEBUG ERRORS:", serializer.errors)  # helpful for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicPropertyListAPIView(APIView):
    def get(self, request):
        properties = Property.objects.filter(status='APPROVED')
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)
    



class PublicPropertyDetailAPIView(RetrieveAPIView):
    queryset = Property.objects.filter(status="APPROVED")
    serializer_class = PropertySerializer
    lookup_field = "id"
class VendorRoomAPIView(APIView):
    permission_classes = [IsAuthenticated,IsVendor]
    def post(self,request):
        property_id = request.data.get('property')

        try:
            property_obj = Property.objects.get(
                id = property_id,
                owner = request.user
            )
        except Property.DoesNotExist:
            return Response(
                {
                    "error" : "Invalid property"
                },
                status = status.HTTP_400_BAD_REQUEST
            )
        serializer = RoomSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(property = property_obj)
            return Response(
                {'message' : 'Room added SuccessFully'},
                status = status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
    def get(self,request):
        rooms = Room.objects.filter(property__owner=request.user)
        serializer = RoomSerializer(rooms,many = True)
        return Response(serializer.data)


class PublicRoomListAPIView(APIView):
    def get(self, request, property_id):
        rooms = Room.objects.filter(
            property__id=property_id,
            property__status='APPROVED',
            is_available=True
        )
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)



class BookingAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @transaction.atomic
    def post(self, request):
        serializer = BookingSerializer(data=request.data)

        # 1️⃣ Validate input
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2️⃣ Extract data
        room = serializer.validated_data['room']   
        quantity = serializer.validated_data['quantity']
        check_in = serializer.validated_data['check_in']
        check_out = serializer.validated_data['check_out']

        # 3️⃣ Lock room row (prevent race condition)
        room = Room.objects.select_for_update().get(id=room.id)

        # 4️⃣ Property must be approved
        if room.property.status != 'APPROVED':
            return Response(
                {"error": "Property is not approved for booking"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 5️⃣ Check availability
        if room.available_units < quantity:
            return Response(
                {"error": "Not enough rooms available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 6️⃣ Reduce availability
        room.available_units -= quantity
        room.save()

        # 7️⃣ Calculate price
        total_price = room.price * quantity

        # 8️⃣ Create booking
        booking = Booking.objects.create(
            user=request.user,
            property=room.property,
            room=room,
            quantity=quantity,
            check_in=check_in,
            check_out=check_out,
            total_price=total_price,
            status='PENDING'
        )

        # 9️⃣ Response
        return Response(
            {
                "message": "Booking created successfully",
                "booking_id": booking.id,
                "total_price": booking.total_price
            },
            status=status.HTTP_201_CREATED
        )
class CancellationBookingAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @transaction.atomic
    def put(self, request, booking_id):
        try:
            booking = Booking.objects.select_for_update().get(
                id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        if booking.status != "CONFIRMED":
            return Response(
                {"error": "Only confirmed bookings can be cancelled"},
                status=400
            )

        room = booking.room
        room.available_units += booking.quantity
        room.save()

        booking.status = "CANCELLED"
        booking.save()

        return Response({"message": "Booking cancelled"})
    
    
class ViewBookingAPIView(APIView):
    permission_classes = [IsAuthenticated,IsCustomer]
    def get(self,request):
        bookings = Booking.objects.filter(
            user = request.user,
        ).order_by('-created_at')
        serializer = MyBookingSerializer(bookings,many = True)
        return Response(serializer.data)

        
class VendorBookingsAPIView(APIView):
    permission_classes = [IsAuthenticated,IsVendor]
    def get(self,request):
        bookings = Booking.objects.filter(
            property__owner = request.user
        ).order_by('-created_at')
        serializer = VendorBookingViewSerializer(bookings,many = True)
        return Response(serializer.data)
    
class vendorDashboardAPIView(APIView):
    permission_classes = [IsAuthenticated,IsVendor]

    def get(self,request):

        vendor = request.user
        total_properties = Property.objects.filter(owner=vendor).count()

        total_rooms = Room.objects.filter(
            property__owner=vendor
        ).count()

        total_bookings = Booking.objects.filter(
            property__owner=vendor
        ).count()

        active_bookings = Booking.objects.filter(
            property__owner=vendor,
            status='CONFIRMED'
        ).count()

        cancelled_bookings = Booking.objects.filter(
            property__owner=vendor,
            status='CANCELLED'
        ).count()

        total_revenue = Booking.objects.filter(
            property__owner=vendor,
            status='CONFIRMED'
        ).aggregate(
            revenue=Sum('total_price')
        )['revenue'] or 0
        return Response({
            "total_properties": total_properties,
            "total_rooms": total_rooms,
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_revenue": total_revenue
        })
    

class CreatePaymentAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @transaction.atomic
    def post(self, request):
        booking_id = request.data.get('booking_id')

        if not booking_id:
            return Response(
                {"error": "booking_id is required"},
                status=400
            )

        try:
            booking = Booking.objects.select_for_update().get(
                id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=404
            )

        # ✅ FIXED CONDITION
        if booking.status != 'PENDING':
            return Response(
                {"error": "Payment allowed only for pending bookings"},
                status=400
            )

        # ✅ prevent duplicate payment
        if Payment.objects.filter(
            booking=booking,
            status='INITIATED'
        ).exists():
            return Response(
                {"error": "Payment already initiated"},
                status=400
            )

        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=booking.total_price,
            status='INITIATED',
            provider='MOCK'
        )

        return Response({
            "message": "Payment initiated",
            "payment_id": payment.id,
            "amount": payment.amount
        }, status=201)
class paymentSuccessAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @transaction.atomic
    def post(self, request):
        payment_id = request.data.get('payment_id')
        provider_payment_id = request.data.get('provider_payment_id')

        if not payment_id or not provider_payment_id:
            return Response(
                {"error": "payment_id and provider_payment_id required"},
                status=400
            )

        try:
            payment = Payment.objects.select_for_update().get(
                id=payment_id,
                user=request.user
            )
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if payment.status != 'INITIATED':
            return Response(
                {"error": "Payment already processed"},
                status=400
            )

        booking = payment.booking
        if Payment.objects.filter(
            booking=booking,
            status='SUCCESS'
            ).exists():
            return Response({"error": "Already paid"}, status=400)

        # ✅ update payment
        payment.status = 'SUCCESS'
        payment.provider_payment_id = provider_payment_id
        payment.save()

        # ✅ FINAL STATE
        booking.status = 'COMPLETED'
        booking.save()

        return Response({
            "message": "Payment successful",
            "booking_id": booking.id,
            "payment_id": payment.id
        })
class PaymentFailureAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @transaction.atomic
    def post(self, request):
        payment_id = request.data.get('payment_id')

        if not payment_id:
            return Response({"error": "payment_id required"}, status=400)

        try:
            payment = Payment.objects.select_for_update().get(
                id=payment_id,
                user=request.user
            )
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)

        if payment.status != 'INITIATED':
            return Response(
                {"error": "Already processed"},
                status=400
            )

        payment.status = 'FAILED'
        payment.save()

        return Response({
            "message": "Payment failed",
            "retry": True
        })
class PropertyImageUploadAPIView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def post(self, request):
        property_id = request.data.get("property")

        try:
            property_obj = Property.objects.get(
                id=property_id,
                owner=request.user
            )
        except Property.DoesNotExist:
            return Response({"error": "Invalid property"}, status=400)

        image = request.FILES.get("image")

        if not image:
            return Response({"error": "Image required"}, status=400)

        PropertyImage.objects.create(
            property=property_obj,
            image=image
        )

        return Response({"message": "Image uploaded"})
    

from django.db.models import Q, Sum

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_booking_status(request, booking_id):
    try:
        booking = Booking.objects.select_for_update().get(
            id=booking_id,
            property__owner=request.user
        )
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    # ✅ Role check
    if request.user.role != "VENDOR":
        return Response({"error": "Unauthorized"}, status=403)

    status_value = request.data.get("status")

    if status_value not in ["CONFIRMED", "CANCELLED"]:
        return Response({"error": "Invalid status"}, status=400)

    room = booking.room

    # 🚨 Prevent double action
    if booking.status == status_value:
        return Response({"message": "Already updated"}, status=200)

    # =========================
    # ✅ CONFIRM BOOKING
    # =========================
    if status_value == "CONFIRMED":

        # 🔥 OVERLAPPING CHECK (IMPORTANT)
        overlapping_bookings = Booking.objects.filter(
            room=room,
            status="CONFIRMED"
        ).exclude(id=booking.id).filter(
            Q(check_in__lt=booking.check_out) &
            Q(check_out__gt=booking.check_in)
        )

        total_booked = overlapping_bookings.aggregate(
            total=Sum('quantity')
        )['total'] or 0

        available = room.total_units - total_booked

        if available < booking.quantity:
            return Response(
                {"error": "Not enough availability for selected dates"},
                status=400
            )

        room.available_units -= booking.quantity
        room.save()

        booking.status = "CONFIRMED"

    elif status_value == "CANCELLED":

        if booking.status == "CONFIRMED":
            room.available_units += booking.quantity
            room.save()

        booking.status = "CANCELLED"

    booking.save()

    return Response({
        "message": "Booking updated successfully",
        "status": booking.status
    })



class RoomImageUploadAPIView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def post(self, request):
        room_id = request.data.get("room")

        try:
            room = Room.objects.get(
                id=room_id,
                property__owner=request.user
            )
        except Room.DoesNotExist:
            return Response({"error": "Invalid room"}, status=400)

        image = request.FILES.get("image")

        if not image:
            return Response({"error": "Image required"}, status=400)

        RoomImage.objects.create(
            room=room,
            image=image
        )

        return Response({"message": "Room image uploaded"})
from django.urls import path
from .views import RoomView
from .views import RoomsGetList

urlpatterns = [
    path('room', RoomView.as_view()),
    path('list', RoomsGetList.as_view())
]
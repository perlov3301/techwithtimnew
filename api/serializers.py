from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 
                  'guest_can_pause', 'votes_to_skip', 'created_at')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[]) #redifining code field
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')

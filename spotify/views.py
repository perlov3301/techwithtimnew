from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
# update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens, execute.spo...
from api.models import Room
import logging

logging.basicConfig(filename='debug.log', encoding='urf-8', level=logging.debug)
# request authorization to spotify
class AuthURL(APIView):
    print("spotify views.py; class AuthURL;")
    # logging.info("spotify views.py; class AuthURL;a")
    logging.debug("spotify views.py; class AuthURL;")
    def get(self, request, format=None): # from spotify documentation
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)
        
# return information to function from request
def spotify_callback(request, format=None):
    print("spotify views.py; spotify_calback;")
    logging.info("spotify views.py; spotify_callback")
    logging.debug("spotify views.py; spotify_callback")
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token =  response.get('access_token')
    token_type =    response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in =    response.get('expires_in')
    error = response.get('error')
    # to safe tokens for multiple users => util.py

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, 
        access_token, token_type, expires_in, refresh_token)
    
    return redirect('frontend:')

class IsAuthenticated(APIView):
    print("spotify views.py; class IsAuthenticated;print")
    # logging.info("spotify views.py; class IsAuthenticated;info")
    logging.debug("spotify views.py; class IsAuthenticated;debug")
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
                                                       # request.session.session_key
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    print("spotify views.py; class CurrentSong;print")
    # logging.info("spotify views.py; class CurrentSong;info")
    logging.debug("spotify views.py; class CurrentSong;debug")
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code') # within the session=> room is exists
        room = Room.objects.filter(code=room_code)[0]
        host = room.host
        endpoint = '/player/currently-playing'
        response = execute_spotify_api_request(host, endpoint)
        print(response)

        return Response(response, status=status.HTTP_200_OK)
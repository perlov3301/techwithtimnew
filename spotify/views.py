from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens, execute_spotify_api_request
from api.models import Room
import logging

logging.basicConfig(filename='spotifyviews.log', encoding='urf-8', 
  level=logging.DEBUG)
# request authorization to spotify
class AuthURL(APIView):
    logging.debug("spotify views.py; class AuthURL;")
    def get(self, request, format=None): # from spotify documentation
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        # logging.debug("spotify views class AuthURL; %s", %scopes)
        logging.debug(" AuthURL REDIRECT_URI:%s", REDIRECT_URI)
        logging.debug("AuthURL CLIENT_ID:%s", CLIENT_ID) 
        logging.debug(" AuthURL url:%s", url) 

        return Response({'url': url}, status=status.HTTP_200_OK)
        
# return information to function from request
def spotify_callback(request, format=None):
    logging.debug("spotify views.py spotify_callback; request:%s", request)
    code = request.GET.get('code')
    error = request.GET.get('error')
    logging.debug("spotify views callback request code:%s", code)
    logging.debug("spotify views callback request error:%s", error) 

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
    logging.debug("spotify views callback response error:%s", error)
    # to safe tokens for multiple users => util.py

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, 
        access_token, token_type, expires_in, refresh_token)
    
    return redirect('frontend:')

class IsAuthenticated(APIView):
    logging.debug("spotify views.py; class IsAuthenticated;debug")
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        logging.debug("spotify views isAuthenticated status:%s", is_authenticated)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    logging.debug("spotify views.py; class CurrentSong;debug")
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')# within the session=>exists
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        logging.debug("spotify views.py; class CurrentSong; host: %s", host)
        response = execute_spotify_api_request(host, endpoint)
        if 'item' not in response:
            logging.debug("sotify views currentsong: there is no item in response")
        else:
            logging.debug("spotify views currentsong: response content something")

        # print(response)
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artist')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name
        
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'umage_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        #return Response(response, status=status.HTTP_200_OK)
        return Response(song, status=status.HTTP_200_OK)
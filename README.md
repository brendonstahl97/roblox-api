# Roblox API Docs

## Endpoints: 

### GET
```/api/placeData/:placeId```

Return the details for the place of the provided placeId parameter.

```/api/getPlace/```

Return a random place.

**Query Options:**

```?visit``` has 4 options: 
  0 = more than 1 visit
  1 = between 1 and 1000 visits
  2 = between 1000 and 10000 visits
  3 = more than 10000 visits

```?date``` determines if the game should have at least one update and can be either ```true``` or ```false```.

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

Example: to get a game that has more than 10000 visits and has been updated at least once you would use the URL ```https://rb6766767.herokuapp.com/api/getPlace/?visit=3&date=true```.

---

```/api/getPopPlace/```

Returns a random popular place.

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

```/api/getRandFavPlace/```

*Experimental*

Returns a random place based on a random user's favorites.

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

```/api/getCuratedPlace/```

Returns a place from our curated list.

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

```/api/getOldPlace/```

Returns a place from our list of old games.

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

```/api/getAnimePlace/```

Returns a random place with Anime in the name.

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

### Post

```/api/getFavPlace/```

Returns a random favorite game from an aggregate list of favorites from all provided userIDs

**Body Format**

Object with data parameter containing array of userIDs. 

Example: ```{ data: [123214432, 4235436] }```

**Query Options:**

```?details``` determines if the game details for the place should be returned (```true```), or only the Place ID (```false```).

---

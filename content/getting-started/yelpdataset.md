---
title: Example Data Set
---

Overview 
--------
The details of the data set are available [here] (https://www.yelp.com/academic_dataset)

The dataset has the following data:

###Business Objects

Business objects contain basic information about local businesses. The 'business_id' field can be used with the Yelp API to fetch even more information for visualizations, but note that you'll still need to comply with the API TOS. The fields are as follows:

```xml
{
  'type': 'business',
  'business_id': (a unique identifier for this business),
  'name': (the full business name),
  'neighborhoods': (a list of neighborhood names, might be empty),
  'full_address': (localized address),
  'city': (city),
  'state': (state),
  'latitude': (latitude),
  'longitude': (longitude),
  'stars': (star rating, rounded to half-stars),
  'review_count': (review count),
  'photo_url': (photo url),
  'categories': [(localized category names)]
  'open': (is the business still open for business?),
  'schools': (nearby universities),
  'url': (yelp url)
}
```

A sample 5 records are shown below:

```xml

```

###Review Objects

Review objects contain the review text, the star rating, and information on votes Yelp users has cast on the review. Use user_id to associate this review with others by the same user. Use business_id to associate this review with others of the same business.

```xml
{
  'type': 'review',
  'business_id': (the identifier of the reviewed business),
  'user_id': (the identifier of the authoring user),
  'stars': (star rating, integer 1-5),
  'text': (review text),
  'date': (date, formatted like '2011-04-19'),
  'votes': {
    'useful': (count of useful votes),
    'funny': (count of funny votes),
    'cool': (count of cool votes)
  }
}
```

A sample 5 records are shown below:

```xml

```

###User Objects
User objects contain aggregate information about a single user across all of Yelp (including businesses and reviews not in this dataset).

```xml
{
  'type': 'user',
  'user_id': (unique user identifier),
  'name': (first name, last initial, like 'Matt J.'),
  'review_count': (review count),
  'average_stars': (floating point average, like 4.31),
  'votes': {
    'useful': (count of useful votes across all reviews),
    'funny': (count of funny votes across all reviews),
    'cool': (count of cool votes across all reviews)
  }
}
```

A sample 5 records are shown below:

```xml

```


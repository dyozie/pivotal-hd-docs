---
title: HAWQ : Count Businesses in a City
---

In this tutorial you will learn how to use HAWQ and its related tools and services to load and query data.

###Use Case###
The sample dataset has information about the Businesses. Each business is located in a city. This use case is a simple example of how to get count how many businesses are there in a city.

### Sample Data ###

For our tutorial we will use the sample data from the following format 

```java
{
 "business_id": "rncjoVoEFUJGCUoC1JgnUA",
 "full_address": "8466 W Peoria Ave\nSte 6\nPeoria, AZ 85345",
 "open": true,
 "categories": ["Accountants", "Professional Services", "Tax Services", "Financial Services"],
 "city": "Peoria",
 "review_count": 3,
 "name": "Peoria Income Tax Service",
 "neighborhoods": [],
 "longitude": -112.241596,
 "state": "AZ",
 "stars": 5.0,
 "latitude": 33.581867000000003,
 "type": "business"
}
```


We have transformed the original `json` data into the format given below so that it can be loaded into a `external table`

```java
	'rncjoVoEFUJGCUoC1JgnUA'|'8466 W Peoria Ave\nSte 6\nPeoria, AZ 85345'|true|'{"Accountants","Professional Services","Tax Services","Financial Services"}'|'Peoria'|3|'Peoria Income Tax Service'|'{}'|-112.241596|AZ|5.0|33.581867000000003|'business''0FNFSzCFP_rGUoJx8W7tJg'|'2149 W Wood Dr\nPhoenix, AZ 85029'|true|'{"Sporting Goods", "Bikes", "Shopping"}'|'Phoenix'|5| 'Bike Doctor'|'{}'|-112.10593299999999|AZ|5.0|33.604053999999998|'business'
```


###Loading Data ###

####Start Service
###Querying the Data###



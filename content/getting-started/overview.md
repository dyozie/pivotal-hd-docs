---
title: Getting Started
---

##Getting Started

Welcome to the Pivotal HD Tutorials.

##Pre-requisites
The following software should be installed to run the tutorials:

1. Pivotal HD Command Center installed
2. Pivotal HD installed and verified

The development machine should have the following:

1. Desktop with Ubuntu 10.x or Centos 6.x and 4GB RAM
3. JDK 1.6 and above installed and set JAVA_HOME
3. Apache Maven installed and mvn command available in the $PATH variable
4. Eclipse with Maven plugin

##Working with Tutorials

The tutorials are organized into several groups with specific tasks. Each task is accompanied with a code sample.
If you are new to Pivotal HD or Hadoop, you should complete each tutorial in the order.

##Summarization Patterns

The  pattern is used for calculating statistical summaries like min, max, count of values in the dataset. The pattern is simple, but using the Combiner effectively is key to improving the performance. The following tutorials illustrate the summarization patterns:

* **[Count of Businesses in a city](map-reduce-java/count-businesses-in-city.html)**
* **[Season and monthly count of reviews](map-reduce-java/count-businesses-reviews-season.html)**

##Filtering Patterns

The Filter Pattern is used to filter the dataset with specific criteria. It does not change the values of the dataset. The pattern is generally used to get a small subset for further analysis. The examples of the pattern are top ten, bloom filter and distinct.

* **[Count of five star rated businesses in a city](map-reduce-java/count-city-fivestar-businesses.html)**

##Joins

Joins in MapReduce are similar to SQL Joins. Since Hadoop framework breaks the processing into Map and Reduce, understanding the join patterns are important in analyzing the data effectively. The critical resource is joining are the computation and the network bandwidth. A number of optimizations are possible and choosing the right join pattern is challenging and specially depends on the dataset formats and size.

The second tutorial below uses the `Distributed Cache` feature of Hadoop to write names into the output instead of cryptic user_ids.

* **[List of Five star reviewers for a Business](map-reduce-java/list-fivestar-reviewers-business.html)**
* **[List of Five star reviewers for a Business with User Names](map-reduce-java/list-fivestar-reviewers-business-with-usernames.html)**


##Spring Hadoop

Spring Hadoop along with Spring Batch provides a powerful framework for running MapReduce Applications in production.

* **[Basic Word Count example with Spring Hadoop](spring-data-hadoop/wordcount_with_spring_hadoop.html)**


##Map Reduce API

* **[Custom Input Format](map-reduce-java/count-businesses-in-city.html)**
* **[Multiple Inputs](map-reduce-java/count-city-fivestar-businesses.html)**
* **[Combiner](map-reduce-java/count-businesses-reviews-season.html)**
* **[Distributed Cache](map-reduce-java/list-fivestar-reviewers-business-with-usernames.html)**
* **[Multiple Outputs](map-reduce-java/count-businesses-reviews-season.html)**

##Source code for the tutorials
The source code for the tutorials is available [here](https://github.com/rajdeepd/pivotal-samples.git)


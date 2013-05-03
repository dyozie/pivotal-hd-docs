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

* **[Count of Businesses in a city](mapreduce-with-java/count-of_businesses-city.html)**

##Filtering Patterns

The Filter Pattern is used to filter the dataset with specific criteria. It does not change the values of the dataset. The pattern is generally used to get a small subset for further analysis. The examples of the pattern are top ten, bloom filter and distinct.

* **[Count of Businesses in a city](mapreduce-with-java/count-of_businesses-city.html)**

##Joins

The Filter Pattern is used to filter the dataset with specific criteria. It does not change the values of the dataset. The pattern is generally used to get a small subset for further analysis. The examples of the this pattern are top ten, bloom filter and distinct.

* **[Join example1](mapreduce-with-java/count-of_businesses-city.html)**


##Spring Hadoop

Spring Hadoop along with Spring Batch provides a powerful framework for running MapReduce Appplications in production.

##Map Reduce API

* **[Custom Input Format](mapreduce-with-java/count-of-businesses-city.html)**
* **[Multiple Inputs](mapreduce-with-java/count-of-businesses-city.html)**


##Source code for the tutorials
The source code for the tutorials is availble
[here] (git@github.com:bluespace9214/pivotal-docs.git)

---
title: Getting started with Pivotal HD
---

The guide provides a set by step tutorial on how to design, build and run MapReduce Applications on Pivtoal HD 2.0 distribution.

The tutorials are organized into several groups with specific tasks. Each task is accompanied with a code sample.
If you are new to Pivotal HD or Hadoop, you should complete each tutorial in the order.

<ol class="class-list">
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>Tutorials</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      The tutorials are covered with an overview of the MapReduce pattern used in the tutorial. The same tutorial can have more than pattern and in that case, the tutorial is listed under multiple patterns.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-in-city.html">
          Count of Businesses in a city
        </a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-city-fivestar-businesses.html">
          Count of five star rated businesses in a city
        </a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/list-fivestar-reviewers-business.html">
          List of Five star reviewers for a Business</a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/list-fivestar-reviewers-business-with-usernames.html">
          List of Five star reviewers for a Business with User Names
        </a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-reviews-season.html">
          Season and monthly count of reviews
        </a>
      </li>
    </ol>
  </li>
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>MapReduce Patterns</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      The pattern is used for calculating statistical summaries like min, max, count of values in the dataset. The pattern is simple, but using the Combiner effectively is key to improving the performance.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-in-city.html">
          Count of Businesses in a city
        </a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-reviews-season.html">
          Season and monthly count of reviews
        </a>
      </li>
    </ol>
  </li>
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>Filtering Patterns</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      The Filter Pattern is used to filter the dataset with specific criteria. It does not change the values of the dataset. The pattern is generally used to get a small subset for further analysis. The examples of the pattern are top ten, bloom filter and distinct.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/map-reduce-java/count-city-fivestar-businesses.html">
          Count of five star rated businesses in a city
        </a>
      </li>
    </ol>
  </li>
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>Joins</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      Joins in MapReduce are similar to SQL Joins. Since Hadoop framework breaks the processing into Map and Reduce, understanding the join patterns are important in analyzing the data effectively. The critical resource is joining are the computation and the network bandwidth. A number of optimizations are possible and choosing the right join pattern is challenging and specially depends on the dataset formats and size.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/map-reduce-java/list-fivestar-reviewers-business.html">
          List of Five star reviewers for a Business
        </a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/list-fivestar-reviewers-business-with-usernames.html">
          List of Five star reviewers for a Business with User Names
        </a>
      </li>
    </ol>
  </li>
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>Map Reduce API</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      The following tutorials covers the MapReduce framework.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-in-city.html">Custom Input Format</a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-city-fivestar-businesses.html">Multiple Inputs</a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-reviews-season.html">Combiner</a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/list-fivestar-reviewers-business-with-usernames.html">Distributed Cache</a>
      </li>
      <li>
        <a href="getting-started/map-reduce-java/count-businesses-reviews-season.html">Multiple Outputs</a>
      </li>
    </ol>
  </li>
  <li>
    <a class="title" href="javascript:void(0)">
      <h2>Spring Hadoop</h2>
      <span></span>
    </a>
    <img src="images/elephant_rgb_sq.png" alt="">
    <p class="description">
      Spring Hadoop along with Spring Batch provides a powerful framework for running MapReduce Applications in production.
    </p>
    <ol class="lesson-list">
      <li>
        <a href="getting-started/spring-data-hadoop/wordcount_with_spring_hadoop.html">Basic Word Count example with Spring Hadoop</a>
      </li>
      <li>
        <a href="/training/basics/intents/result.html">
          Getting a Result from the Activity
        </a></li><li><a href="/training/basics/intents/filters.html">
          Allowing Other Apps to Start Your Activity
        </a>
      </li>
    </ol>
  </li>
</ol>

##Working with Tutorials

###Source code for the tutorials
The source code for the tutorials is available [here](https://github.com/rajdeepd/pivotal-samples.git)

###Pre-requisites
The following software should be installed to run the tutorials:

1. Pivotal HD Command Center installed
2. Pivotal HD installed and verified

The development machine should have the following:

1. Desktop with Ubuntu 10.x or Centos 6.x and 4GB RAM
3. JDK 1.6 and above installed and set JAVA_HOME
3. Apache Maven installed and mvn command available in the $PATH variable
4. [Eclipse IDE for Java Developers](http://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/junos) with Maven plugin


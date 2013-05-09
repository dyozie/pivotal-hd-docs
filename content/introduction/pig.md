---
title: Pig
---

Overview
--------
Pig is a DataFlow Language, initially developed at Yahooo! to allow users using Hadoop to focus on analyzing largedata sets, and spend less time having to write mapper and reducer programs.
Pig enables you to manipulate data as tuples in simple pipelines without thinking about the complexities of MapReduce.

Pig is some where between simple SQL and multi-step mapreduce in terms of complexity. It can be used to create complex multi-step data flows that, otherwise, would be available only to very experienced Java programmers. Pig is made up of two components. first, is the language itself called PigLatin. Second, Pig Engine, which parses, optimizes, and automatically executes PigLatin scripts as a series of MapReduce jobs on a Hadoop cluster.


About Pig
----------

Pig statements represent data operations similar to individual operators in SQL – load, sort, join, group, aggregate, etc. Each Pig statement accepts one or more datasets as inputs and returns a single data set as an output.
Pig is extensible through User Defined Functions that are written in Java. These can be used to implement complex business logic, bridge to other systems such as Mahout or R, and read or write from external data sources.

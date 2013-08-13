Pivotal HD 
===========

This documentation explains various components and services of Pivotal HD.  The Getting Started section walks through the installation and gives an overview of Hadoop with simple examples.


Run & Deploy
----------
Clone and do the following to get the site up and running locally:

```ruby
bundle install
nanoc compile
nanoc view
```

When you're ready to push to Cloud Foundry:

```ruby
cd output
bundle install
cf push
```

You don't need any services to run this app.


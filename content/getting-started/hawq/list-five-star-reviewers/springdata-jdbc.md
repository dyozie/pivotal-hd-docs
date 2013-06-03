---
title: Spring Data JDBC - List of Five star reviewers (users) for a Business    
---

In this document we will cover the how to join tables with using Spring Data JDBC with Pivotal HD SQL Service HAWQ

### Prerequisites

*  This tutorial assumes you have a working Pivotal HD installation
*  HAWQ has been configured.
*  You are familiar with Spring Framework
*  [Eclipse IDE for Java](http://www.eclipse.org) or [Spring Source Tool Suite](http://www.springsource.org/sts) has been Installed on the Name Node

###Use Case

We will be implementing the use case : List of Five star reviewers (users) for a Business

### DataSet

You will use the [yelp data set](/getting-started/yelpdataset.html) format for this Spring JDBC Sample. For this particular sample we will use the same data set as used in [hawq exercise](/getting-started/hawq/list-five-star-reviewers.html)

Make sure the table `business` and `review` have been created and appropriate values inserted using `COPY` psql command as specified in the [hawq exercise](/getting-started/hawq/list-five-star-reviewers.html)

### Source Code ###

Source code for the sample can be found at [github.com/rajdeepd/pivotal-samples/](https://github.com/rajdeepd/pivotal-samples).

Clone the github repo into a local directory on the machine running Name Node

```bash
$git clone https://github.com/rajdeepd/pivotal-samples
```

The sample source can be found under the directory `pivotal-samples/spring-data-jdbc/spring-jdbc-list-fivestar-business-reviewers`

###Implementation ###

This sample uses Spring Data Access and JDBC Template to query the HAWQ data source. HAWQ data source uses the drivers and other JDBC URL semantics of a PostgreSQL database. 
Spring Data Access uses Dependency Injection to separate the JDBC code from data access configuration.

The sample uses `org.springframework.jdbc.core.JdbcTemplate` to access the datasource through a Postgres JDBC Type 4 driver. This sample uses maven to resolve the external Spring Dependencies.

*  Spring Dependencies
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${spring.framework.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${spring.framework.version}</version>
</dependency>
```

*  Database driver dependency : This sample uses the latest **Postgres** JDBC Type 4 driver.

```xml
<dependency>
    <groupId>postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>9.1-901.jdbc4</version>
</dependency>
```

Following steps outline the flow of the application:

*  This sample is a Java Application with the main entry point being `ListFiveStarBusinessReviewers`. This class has following methods

```java
public Class ListFiveStarBusinessReviewers {
    ...
    public ListFiveStarBusinessReviewers() {
        ..
    }  
    public void executeQuery {
        ..
    }
    public static void main( String[] args) {
        ..
    }
}
```

*  There are three class level variables defined. 
  1.  Spring `ApplicationContext` - instantiated from the context application xml
  2.  `DataSource` - instantiated from the `ApplicationContext`
  3.  `JdbcTemplate` - instantiated from the `DataSource` of type `org.apache.commons.dbcp.BasicDataSource`

```java
ApplicationContext context;
JdbcTemplate template;
```

*    Class `JdbcConfiguration` provides an implementation of `JdbcTemplate` bean. It is annotated with `@Configuration` and `@PropertySource(..)`.
*    Method `jdbcTemplate(Environment environment)` is annotated with `@Bean` and overridden
*    java.sql.Driver Object ,Jdbc Url:  `url`, Username : `user` and password `pwd` are extracted from `org.springframework.core.env.Environment`.
*    A `SimpleDriverDataSource` object is instantiated
*    A `JdbcTemplate` object is instantiated from this DataSource object above and returned
    
```java
@Configuration
@PropertySource("classpath:/jdbc.properties")
public class JdbcConfiguration {
    @Bean(name = "jdbc")
    public JdbcTemplate jdbcTemplate(Environment environment)
            throws InstantiationException, IllegalAccessException,
            ClassNotFoundException {
        java.sql.Driver driver = (java.sql.Driver) Class.forName(
                environment.getProperty("jdbc.driverClassName")).newInstance();
        String url = environment.getProperty("jdbc.url");
        String user = environment.getProperty("jdbc.username");
        String pw = environment.getProperty("jdbc.password");
        return new JdbcTemplate(new SimpleDriverDataSource(driver, url, user,pw));
    }
}
```

*    In the ListFiveStarBusinessReviewers constructor `ApplicationContext` and `JdbcTemplate` are initialized 
```java
public ListFiveStarBusinessReviewers() {
    context = new AnnotationConfigApplicationContext(JdbcConfiguration.class);
    jdbcTemplate = (JdbcTemplate) context.getBean("jdbc");
}
```

*    Define a Custom Data class `RowRecord` to be populated by the `RowMapper` from the `ResultSet`.  
*    com.spring.RowMapper : An interface used by JdbcTemplate for mapping rows of a ResultSet on a per-row basis

```java
public class RowRecord {
    private String name;
    private String user_id;
    public RowRecord(String name, String user_id) {
        this.name = name;
        this.user_id = user_id;
    }
    public String getName() {
        return name;
    }
    public int getUser_Id() {
        return user_id;
    }
    public String toString() {
         String s = "{" +
                "name=" + name + "," +
                "user_id=" + user_id + 
                 "}";
         return s;
     }
}
```

*  `JDBCTemplate` object `jdbcTemplate` will execute the select query listed below. Returned `ResultSet` is mapped to a List of `City` objects.

```java
 public void executeQuery() {
               List<RowRecord> rowRecords = template
              .query("select name,user_id FROM business JOIN review  ON (business.business_id=review.business_id AND review.stars=5.0) ",
                                                new RowMapper<RowRecord>() {
                                                        public RowRecord mapRow(ResultSet rs, int rowNum)
                                                                        throws SQLException {
                                                                RowRecord row = new RowRecord();
                                                                row.name = rs.getString("name");
                                                                row.user_id = rs.getString("user_id");
                                                                return row;
                                                        }
                                                });
                System.out.println("Returned: " + rowRecords);
        }
```

###Compiling the Sample ###

Sample can be compiled by executing the following `mvn` command from the shell. This will download all the jars this sample has dependencies on.

```bash
$mvn clean compile
$mvn install
```

###Running the Sample###

Sample can be run from within eclipse. *Right click* on `ListFiveStarBusinessReviewers` class and click `Run as Java Application`.

###Output ###

The output can be see in the Eclipse console

```bash
Returned: [{name=Bike Doctor,user_id=yEQacRqY2MJRHTkrUJYLOw}, {name=Bike Doctor,user_id=muIhE1HQZscwe06ISMu81A}, {name=Bike Doctor,user_id=WkEu8km8U-6X-mm5OdkHjw}, {name=Peoria Income Tax Service,user_id=EnAdKZ_u_wj9ifTRwkfVwg}, {name=Valley Permaculture Alliance,user_id=w6DgbWFq671y50A_QsILwQ}]

```

You can also see the status of HAWQ query on the Pivotal Command Center and time taken to execute.

![import](/images/gs/hawq/list-five-star-reviewers/spring-jdbc/hawq.png)

This completes the Exercise of running a join query with Spring JDBC on HAWQ using Postgres Driver

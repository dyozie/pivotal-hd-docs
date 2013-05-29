---
title: Spring Data JDBC - Count Businesses in a City    
---

In this document we will cover the basics of how to get started with using Spring Data JDBC with Pivotal HD SQL Service HAWQ

### Prerequisites

*  This tutorial assumes you have a working Pivotal HD installation
*  HAWQ has been configured.
*  You are familiar with Spring Framework
*  [Eclipse IDE for Java](http://www.eclipse.org) or [Spring Source Tool Suite](http://www.springsource.org/sts) has been Installed on the Name Node

###Use Case

We will be implementing the use case : Number of businesses in the dataset from each city

### DataSet

You will use the [yelp data set](/getting-started/yelpdataset.html) format for this Spring JDBC Sample. For this particular sample we will use the same data set as used in [hawq exercise](/getting-started/hawq/count-business-in-city.html)

Make sure the table `business` has been created and appropriate values inserted using `COPY` psql command as specified in the [hawq exercise](/getting-started/hawq/count-business-in-city.html)

### Source Code ###

Source code for the sample can be found at [github.com/rajdeepd/pivotal-samples/](https://github.com/rajdeepd/pivotal-samples).

Clone the github repo into a local directory on the machine running Name Node

```bash
$git clone https://github.com/rajdeepd/pivotal-samples
```

The sample source can be found under the directory `pivotal-samples/spring-data-jdbc/spring-jdbc-count-business-in-city`

### Import the Project into Eclipse###

Select File->Import and select `Existing projects into Workspace`

![import](/images/gs/hawq/count-business/spring-jdbc/import-maven.png)

Click `Browse` to select the directory where source code is present

![import](/images/gs/hawq/count-business/spring-jdbc/browse.png)

Select the directory and click `Open`

Click `Deselect All` and check the box for the project we are interested in and Click `Finish`

![import](/images/gs/hawq/count-business/spring-jdbc/select-project.png)


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

Following step outline the flow of the application login

*  This sample is a Java Application with the main entry point being `BusinessCount`. This class has following methods

```java
public Class BusinessCount {
    ...
    public BusinessCount() {
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

*    In the BusinessCount constructor `ApplicationContext` and `JdbcTemplate` are initialized 
```java
public BusinessCount() {
    context = new AnnotationConfigApplicationContext(JdbcConfiguration.class);
    jdbcTemplate = (JdbcTemplate) context.getBean("jdbc");
}
```

*    Define a Custom Data class `RowRecord` to be populated by the `RowMapper` from the `ResultSet`.  
*    com.spring.RowMapper : An interface used by JdbcTemplate for mapping rows of a ResultSet on a per-row basis

```java
public class City {
    private int countOfBusinesses;
    private String cityName;
    public City(String name, int count) {
        this.cityName = name;
        this.countOfBusinesses = count;
    }
    public String getCityName() {
        return cityName;
    }
    public int getCountOfBusinesses() {
        return countOfBusinesses;
    }
    public String toString() {
         String s = "{" +
                "city=" + cityName + "," +
                "count=" + countOfBusinesses + 
                 "}";
         return s;
     }
}
```

*  `JDBCTemplate` object `jdbcTemplate` will execute the select query listed below. Returned `ResultSet` is mapped to a List of `City` objects.

```java
public void executeQuery() {
       List<City> rowRecords = jdbcTemplate.query(
        "select city,count(*) countOfBusinesses from business group by city",
        new RowMapper<City>() {
            public City mapRow(ResultSet rs, int rowNum) throws SQLException {
                return new City(rs.getString("city"), rs.getInt("countOfBusinesses"));
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

Sample can be run from within eclipse. *Right click* on `BusinessCount` class and click `Run as Java Application`.

###Output ###

The output can be see in the Eclipse console

```bash
Returned: [{city=Glendale,count=1}, {city=Tempe,count=1}, {city=Glendale Az,count=1}, {city=Phoenix,count=7}, {city=Gilbert,count=1}, {city=Fountain Hills,count=1}, {city=Scottsdale,count=2}, {city=Peoria,count=1}]
```

You can also see the status of HAWQ query on the Pivotal Command Center and time taken to execute.

![import](/images/gs/hawq/count-business/spring-jdbc/hawq.png)

This completes the Exercise of running a basic Spring JDBC Sample on HAWQ using Postgres Driver

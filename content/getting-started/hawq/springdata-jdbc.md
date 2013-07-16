---
title: Spring Data JDBC - Top ten Revenue Generating Postal codes    
---

In this document we will cover the basics of how to get started with using Spring Data JDBC with Pivotal HD SQL Service HAWQ

### Prerequisites

*  This tutorial assumes you have a working Pivotal HD installation
*  HAWQ has been configured.
*  You are familiar with Spring Framework
*  [Eclipse IDE for Java](http://www.eclipse.org) or [Spring Source Tool Suite](http://www.springsource.org/sts) has been Installed on the Name Node

###Use Case

We will be implementing the use case: Top ten Revenue Generating Postal codes

### DataSet

You will use the [Retail Demo](/getting-started/dataset.html) dataset for this Spring JDBC Sample.
Make sure the table `retail_demo.orders_hawq` has been created and appropriate values inserted using `COPY` psql command as specified in the [hawq exercise](/getting-started/hawq/internal-tables.html)

### Source Code ###

Source code for the sample can be found at [github.com/PivotalHD/pivotal-samples/](https://github.com/PivotalHD/pivotal-samples).
Clone the github repo into a local directory on the machine running Name Node

```bash
$git clone https://github.com/PivotalHD/pivotal-samples.git
```

The sample source can be found under the directory `pivotal-samples/spring-data-jdbc/spring-jdbc-topten-business-zipcode`

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


The following steps outline the flow of application

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
*    In the BusinessCount constructor `ApplicationContext` and `JdbcTemplate` are initialized 
```java
public BusinessCount() {
    context = new ClassPathXmlApplicationContext("datasources-beans.xml");
    dataSource = context.getBean("postGresDataSource", DataSource.class);
    template = new JdbcTemplate(dataSource);
    }
```

*    Define a Custom Data class `RowRecord` to be populated by the `RowMapper` from the `ResultSet`.  
*    com.spring.RowMapper : An interface used by JdbcTemplate for mapping rows of a ResultSet on a per-row basis
*  `JDBCTemplate` object `jdbcTemplate` will execute the select query listed below. Returned `ResultSet` is mapped to a List of `City` objects.

```java
public void executeQuery() {
    List<RowRecord> rowRecords = template
    .query("select billing_address_postal_code, sum(total_paid_amount::float8) as total, sum(total_tax_amount::float8) as tax from retail_demo.orders_hawq group by billing_address_postal_code order by total desc limit 10;",
        new RowMapper<RowRecord>() {
        public RowRecord mapRow(ResultSet rs, int rowNum)
        throws SQLException {
        RowRecord row = new RowRecord();
        row.billing_address_postal_code = rs.getString("billing_address_postal_code");
        row.total = rs.getInt("total");
        row.tax = rs.getFloat("tax");
        return row;
        }
        });
        System.out.println("Returned: " + rowRecords);
    }
```

###Compiling the Sample ###

Sample can be compiled by executing the following `mvn` command from the shell. This will download all the required jars.

```bash
$mvn clean compile
$mvn install
```

###Running the Sample###

Sample can be run from within eclipse. *Right click* on `BusinessCount` class and click `Run as Java Application`.

###Output ###

The output can be seen in the Eclipse console as shown below.

```bash
Returned: [Returned: [{total=111868}{billing_address_postal_code=48001}{tax=6712.099}, {total=107958}{billing_address_postal_code=15329}{tax=6477.4946}, {total=103244}{billing_address_postal_code=42714}{tax=6194.675}, {total=101365}{billing_address_postal_code=41030}{tax=6081.93}, {total=100511}{billing_address_postal_code=50223}{tax=6030.698}, {total=83566}{billing_address_postal_code=03106}{tax=0.0}, {total=77383}{billing_address_postal_code=57104}{tax=3095.3452}, {total=73673}{billing_address_postal_code=23002}{tax=3683.683}, {total=68282}{billing_address_postal_code=25703}{tax=4096.9272}, {total=66836}{billing_address_postal_code=26178}{tax=4010.184}]]
```
This completes the Exercise of running a basic Spring JDBC Sample on HAWQ using Postgres Driver

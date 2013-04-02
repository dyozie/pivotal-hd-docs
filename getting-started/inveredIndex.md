##Getting Started   
###Inverted Index

___Brief___:  

Inverted indexes store for each word, the list of documents that the word appears in.       
It is often convenient to index large data sets on keywords, so that searches can trace terms back to records that contain specific values.    While building an inverted index does require extra processing up front, taking the time to do so can greatly reduce the amount of time it    
takes to find something.    
Search engines build indexes to improve search performance. Imagine entering a keyword and letting the engine crawl the Internet and build     
a list of pages to return to you. Such a query would take an extremely long amount of time to complete. By building an inverted index, the   search engine knows all the web pages related to a keyword ahead of time and these results are simply displayed to the user. These indexes   
are often ingested into a database for fast query responses.      
    
An inverted index is a word-oriented mechanism for indexing a text collection in order to speed up the searching task. The inverted file    structure is composed of two elements: the vocabulary and the occurrences. The vocabulary is the set of all different words in the text. For    each such word a list of all the text positions where the word appears is stored. The set of all those lists is called the occurrences. These    positions can refer to words or characters. Word positions (i.e., position i refers to the i-th word) simplify phrase and proximity queries.    Figure 1 shows an example:   
  
___Input___      
  
www.kohls.com,clothes,shoes,beauty,toys   
www.amazon.com,books,music,toys,ebooks,movies,computers  
www.ebay.com,auctions,cars,computers,books,antiques   
www.macys.com,shoes,clothes,toys,jeans,sweaters    
www.kroger.com,groceries    
  
___Mapper Code___   
  
Mapper gets a line at a time, splits the line and emits key value pairs where Key is a category of product and value is the website which is    selling the product. For example line retailer,category1,category2 will be emitted as (category1,retailer) and (category2,retailer).  
  
	public class InvertedIndexMapper extends Mapper<LongWritable, Text, Text, Text> 
	{
		public static final int RETAIlER_INDEX = 0;    
 		@Override
		public void map(LongWritable longWritable, Text text, Context context) throws IOException, InterruptedException 
		{
			final String[] record = StringUtils.split(text.toString(), ",");
			final String retailer = record[RETAIlER_INDEX];
			for (in	t i = 1; i < record.length; i++) 
			{
				final String keyword = record[i];     
   				context.write(new Text(keyword), new Text(retailer));
   			}
  		}
 	}
   
___Reducer Code___  
   
Reducer gets a key and a list of values, transforms the list of values to a comma delimited String and emits the key and value out.  
  
	public class InvertedIndexReducer extends Reducer<Text, Text, Text, Text> 
	{
		@Override
		public void reduce(Text text, Iterable<Text> textIterator, Context context)throws IOException, InterruptedException 
		{ 
			StringBuffer sbf = new StringBuffer();
			for (Text val : textIterator) 
			{
				sbf.append(val.toString());
				sbf.append(",");
			}
			context.write(text, new Text(sbf.toString()));
		}
	}  

___OutPut___  
  
		antiques      www.ebay.com
		auctions	     www.ebay.com
		beauty        www.kohls.com
		books         www.ebay.com,www.amazon.com
		cars          www.ebay.com
		clothes       www.kohls.com,www.macys.com
		computers     www.amazon.com,www.ebay.com
		ebooks        www.amazon.com
		jeans         www.macys.com
		movies        www.amazon.com
		music         www.amazon.com
		shoes         www.kohls.com,www.macys.com
		sweaters      www.macys.com
		toys          www.macys.com,www.amazon.com,www.kohls.com
		groceries     www.kroger.com  
  

___Notes___       
   
The performance of building an inverted index depends mostly on the computational cost of parsing the content in the mapper, the 
cardinality of the index keys, and the number of content identifiers per key.  
       
___MRunit Testing___        
   
Now lets use MRUnit to write various tests for this Job. Three key classes in MRUnits are ***MapDriver*** for Mapper Testing, ***ReduceDriver***          for Reducer Testing and ***MapReduceDriver*** for end to end MapReduce Job testing.MRUnit is a test framework used to unit test MapReduce code.        
   
_Setting up the Test Class_       
       
_Approach_      
       
1. A map test that only tests a map function (supported by the MapDriver class).   
2. A reduce test that only tests a reduce function (supported by the ReduceDriver class).   
3. A map and reduce test that tests both the map and reduce functions (supported by the MapReduceDriver class).       
   
_Code_    

	@Before
	public void setUp() throws Exception 
	{

		final InvertedIndexMapper mapper = new InvertedIndexMapper();
		final InvertedIndexReducer reducer = new InvertedIndexReducer();
		mapDriver = MapDriver.newMapDriver(mapper);
		reduceDriver = ReduceDriver.newReduceDriver(reducer);
		mapReduceDriver = MapReduceDriver.newMapReduceDriver(mapper, reducer);
	}  
   
Create the map and reduce objects .       
Use MRUnit driver classes for testing. Specify the key/value input and output types in this class for the mapper or reducer testing .    
   
_Testing Mapper_    

	@Test
	public void testMapper() throws Exception 
	{

		final LongWritable inputKey = new LongWritable(0);
		final Text inputValue = new Text("www.kroger.com,groceries");
		final Text outputKey = new Text("groceries");
		final Text outputValue = new Text("www.kroger.com");
		mapDriver.withInput(inputKey, inputValue)
			.withOutput(outputKey, outputValue).runTest();

	}   
   
The ___withInput___ method is used to specify an input key/value, which will be fed to the Mapper.       
The ___withOutput___ method is used to specify the output key/value, which MRUnit will compare against the output generated by the mapper being tested      
    
_Input_   
	Key ---- 0 (line number)
	Value --- www.kroger.com,groceries

_Output_     
	Key ----  groceries
	Value ---  www.kroger.com  

_Testing Reducer_   

	@Test
	public void testInvertedIndexReducer() throws Exception 
	{

		new ReduceDriver<Text, Text, Text, Text>()
		.withReducer(new InvertedIndexReducer())
		.withInputKey(new Text("books"))
		.withInputValues(Arrays.asList(new Text("www.amazon.com"),new Text("www.ebay.com")))
		.withOutput(new Text("books"),new Text("www.amazon.com,www.ebay.com,"))
		.runTest();  
	}     
    
The ___withInput___ method is used to specify an input key/value,When testing the reducer specify a list of values that MRUnit sends to the reducer.    
Check output using ___withOutput___ .   
  
_Input_    
	key-- books
	values-- www.amazon.com, www.ebay.com

_Output_    
  
	Key-- books  
	Values--www.amazon.com,www.ebay.com  

___Testing Map Reducer___    

	@Test  
	public void testMapReduce() throws Exception 
	{

		mapReduceDriver
		.withInput(new LongWritable(0),new Text("www.kohls.com,clothes,shoes"))
		.withInput(new LongWritable(1),new Text("www.macys.com,shoes,clothes"))
		.withOutput(new Text("clothes"),new Text("www.kohls.com,www.macys.com,"))
		.withOutput(new Text("shoes"),new Text("www.kohls.com,www.macys.com,"))
		.runTest();
	}  
  
MRUnit also supports testing the map and reduce functions in the same test.  Feed inputs to the MRUnit, which in turn are supplied to the mapper. With the MapReduce driver, provide the map input and output key/value types, as well as the reducer key/value output types.  

_Input_

	www.kohls.com,clothes,shoes
	www.macys.com,shoes,clothes

_Output_

	key                  value
	clothes     www.kohls.com,www.macys.com,
	shoes       www.kohls.com,www.macys.com,
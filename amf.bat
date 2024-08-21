CALL mvn -B -f server/pom.xml package
java -cp "./lib/*;./server/target/*" xyz.hydar.ee.Hydar amf.properties
:: javac something something
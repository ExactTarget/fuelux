import org.tap4j.consumer.TapConsumerFactory;
import org.tap4j.consumer.TapConsumer;
import org.tap4j.model.TestSet;
import org.tap4j.model.TestResult;
import org.tap4j.parser.Tap13YamlParser;
import java.io.*;

public class Test{

    public static void main(String[] argv) throws Exception{
        if (argv.length == 0){
            System.err.println("Please supply a file name as argument.");
            System.exit(1);
        }
        String filename = argv[0];
        BufferedReader input = new BufferedReader(new FileReader(filename));
        StringBuilder contents = new StringBuilder();
        String line;
        while (null != (line = input.readLine())){
            contents.append(line);
            contents.append("\n");
        }

        String tapText = contents.toString();

        TapConsumer consumer = TapConsumerFactory.makeTap13YamlConsumer();
        TestSet tests = consumer.load(tapText);

        for (int i = 0; i < tests.getNumberOfTestResults(); i++){
            TestResult test = tests.getTestResult(i + 1);
            System.out.print("Test " + test.getTestNumber() + " ");
            System.out.print(test.getDescription() + " ");
            System.out.println(test.getStatus());
        }
        

        System.out.print(tests.getNumberOfTestResults() + " tests total. ");
        if (tests.containsNotOk()){
            System.out.println("Some tests failed :(");
        }else{
            System.out.println("ALL PASSED :D");
        }

    }

}
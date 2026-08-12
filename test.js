if(student.branch !==""){
    console.log("TC-08:Branch Validation Passed");
}
else{
    console.log("TC-08: Branch Validation Failed");
    passed = false;
}

if(passed){
    console.log("TC-10 : Registration Successful : Pass")
    console.log("/nBuild success");
    process.exit(0);
}
else{
    console.log("TC-10: Registration successful");
    console.log
}
const originalFilePath = './files/original/';
const newFilePath = './files/moved/';
const fs = require('fs');

fs.exists(newFilePath, (exists) => {
    if(exists) {
        console.log("Path already exists");
    }
    else {
        fs.mkdir(newFilePath, (err) => {
            throw err;
        });
    }
});

fs.readdir(originalFilePath,(err,files) => {
    if(err) throw err;
    
    files.forEach(file => {
        editFileContents();
        function editFileContents() {
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var hour = dateObj.getHours();
            var seconds = dateObj.getSeconds();
            newDate = year + "-" + month + "-" + day + "_" + hour + "-" + seconds;
            var extensionText = ".txt";
            var extensionJSON = ".json";
            if(file.match(extensionText)){
                var pos = file.lastIndexOf(extensionText);
                var editedFileName = file.substr(0,pos) + "_edited_"+newDate+extensionText;
                fs.appendFile(originalFilePath + file, '\n' + file + '\n' + originalFilePath + '\n' + editedFileName + '\n' + newFilePath, function (err) {
                    if (err) throw err;
                    //console.log('Saved!');
                });
                fs.rename(originalFilePath + file, newFilePath + editedFileName, function (err) {
                    if (err) throw err
                    console.log('Successfully moved!')
                });
            }
            else {
                var pos = file.lastIndexOf(extensionJSON);
                var editedFileName = file.substr(0,pos) + "_edited_"+newDate+extensionJSON;
                var jsonFilePath = originalFilePath + file;
                
                fs.readFile(jsonFilePath, 'utf8', (err,data) => {
                    if(err) console.log(err);
                    else{
                        console.log(data);
                        let obj = JSON.parse(data);
                        obj.originalName = file;
                        obj.originalPath = originalFilePath;
                        obj.newFileName = editedFileName;
                        obj.newFilePath = newFilePath;
            
                        fs.writeFile(jsonFilePath,JSON.stringify(obj), (err) => {throw err;});
                        fs.rename(originalFilePath + file, newFilePath + editedFileName, function (err) {
                            if (err) throw err
                            console.log('Successfully moved!')
                        });
                    }
                    // console.log(data);
                    // let obj = JSON.parse(data);
                    // obj.originalName = file;
                    // obj.originalPath = originalFilePath;
                    // obj.newFileName = editedFileName;
                    // obj.newFilePath = newFilePath;
        
                    // fs.writeFile(jsonFilePath,JSON.stringify(obj));
                    // fs.rename(originalFilePath + file, newFilePath + editedFileName, function (err) {
                    //     if (err) throw err
                    //     console.log('Successfully moved!')
                    // });
                });
            }
            
        }
    });
})
    

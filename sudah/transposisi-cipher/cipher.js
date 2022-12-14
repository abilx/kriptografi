//This function returns an list that is the number order of the keyword based on Unicode
function orderKeyword(keyword){
    var arraySize = keyword.length, keywordList = [], counter = 0;
    for(var i = 0; i < arraySize; i++){
        keywordList[i] = keyword.charCodeAt(i);
    }
    //This will output a list of the column order using counter
    var keywordOrdered = [...keywordList];
    var min = Math.min(...keywordList);
    while(counter < arraySize){
        //Check if min exists in keywordList
        while(keywordList.indexOf(min) === -1){
            min++;
        }

        //Place the column order of the current min item
        var minIndex = keywordList.indexOf(min);
        keywordOrdered[minIndex] = counter++;

        //Check for duplicates
        var dup = keywordList.indexOf(min, minIndex + 1);
        while(dup != -1){
            keywordOrdered[dup] = counter++;
            dup = keywordList.indexOf(min, dup + 1);
        }
        //Increment the minimum
        min++;
    }
    return keywordOrdered;
}

//This function puts the input into a 2D array based on keyword length
function createEncipherArray(input, keyword){
    //Need lengths to determine array dimensions
    let total = input.length;
    let columns = keyword.length;

    //We divide Input length by Keyword length to know the number of rows we need
    var rows = Math.ceil(total / columns);

    //Loop to create 2D array using 1D array
    var eArray = new Array(rows);
    for (var i = 0; i < eArray.length; i++){
        eArray[i] = []; //This makes it 2D
    }
    //Think of 'i' as the row and 'j' as the column
    //The loops move from left to right, then down to the next row
    //h is a counter to go through input characters
    var character, h = 0;
    for (var i = 0; i < rows; i++){
        for (var j = 0; j < columns; j++){
            character = input[h++];
            //If the input doesn't fill in all spaces, we use 'x' for padding 
            if (typeof(character) == 'undefined'){
                eArray[i][j] = "x";
            }
            else{
                eArray[i][j] = character;
            }
        }
    }
    return eArray;
}

//This function puts the input into a 2D array based on the keyword
function createDecipherArray(input, keywordList){
    //Need lengths to determine array dimensions
    let total = input.length;
    let columns = keywordList.length;
    
    //We divide Input length by Keyword length to know the number of rows we need
    var rows = Math.ceil(total / columns);

    //Loop to create 2D array using 1D array
    var dArray = new Array(rows);
    for (var i = 0; i < dArray.length; i++){
        dArray[i] = []; //This makes it 2D
    }

    //Need to add dummy data so array indexes can be referenced later, or else undefined error
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
            dArray[i][j] = "";
        }
    }

    //We select a column based on keywordList and fill in characters moving down each row
    //h is a counter to go through input characters
    const max = Math.max(...keywordList);
    var character, h = 0;
    for(var column = 0; column <= max; column ++){
        for(var row = 0; row < dArray.length; row++){
            character = input[h++];
            //Notice how we go down each row and pick the index position of what keywordList item we are on
            if (typeof(character) == 'undefined'){
                dArray[row][keywordList.indexOf(column)] = " ";
            }else{
                dArray[row][keywordList.indexOf(column)] = character;
            }
        }
    }
    return dArray;
}

//This function takes the enciphering array and returns ciphertext
function outputCiphertext(keywordList, eArray){
    var cipherText = "", max = Math.max(...keywordList);

    //We pull from that column and add to our ciphertext
    for(var column = 0; column <= max; column ++){
        for(var row = 0; row < eArray.length; row++){
            //Notice how we go down each row and pick the index position of what keywordList item we are on
            cipherText += eArray[row][keywordList.indexOf(column)];
        }
    }
    return cipherText;
}

//This function takes the deciphering array and returns the plaintext
function outputPlaintext(keywordList, dArray){
    var plainText = "", max = Math.max(...keywordList);
    
    //Remember, out by rows so just read through the array
    for(var row = 0; row < dArray.length; row++){
        for(var column = 0; column < keywordList.length; column++){
            plainText += dArray[row][column];
        }
    }
    return plainText;
}

//This function uses Tabulator to create the table that will be shown
function buildTable(ctArray, list){
    var tableData = [];
    //Automatically generate the column headers based on the number of columns aka list.length
    //{list[0]:ctArray[0][0], list[1]:ctArray[0][1], etc}
    //Iterate through the array with for loop for the number of rows aka ctArray.length, then for loop for the length of that row aka list.length
    var row = {}, header;
    for(var i = 0; i < ctArray.length; i++){
        for(var j = 0; j < list.length; j++){
            row = {...row, [list[j]]:ctArray[i][j]};
        }
        tableData.push(row);
    }
    var table = new Tabulator("#columnarTable",{
        data:tableData,
        layout:"fitColumns",
        movableColumns:true,
        autoColumns:true
    });
    table.redraw();
    return table;
}

//This function handles the enciphering process, remember in by rows and out by columns
function columnarEncipher(input, keyword){
    var eArray = createEncipherArray(input, keyword);
    var keywordList = orderKeyword(keyword);
    return outputCiphertext(keywordList, eArray);
}

//This function handles the deciphering process, remember in by columns and out by rows
function columnarDecipher(input, keyword){
    var keywordList = orderKeyword(keyword);
    var dArray = createDecipherArray(input, keywordList);
    return outputPlaintext(keywordList, dArray);
}








function generateKey(text, key) {
  newKey = key;
  x = text.length;
  for (i = 0; true; i++) {
    if (i == x) {
      i = 0;
    }
    if (newKey.length == text.length) {
      break;
    }
    newKey += newKey.charAt(i);
  }
  return newKey;
}

function sanitize(input) {
  lowercase = input.toLowerCase();

  noSymbols = "";
  alpha = "abcdefghijklmnopqrstuvwxyz";
  for (i = 0; i < lowercase.length; i++) {
    for (j = 0; j < alpha.length; j++) {
      if (lowercase.charAt(i) == alpha.charAt(j)) {
        noSymbols += lowercase.charAt(i);
        break;
      }
    }
  }

  return noSymbols;
}

function getCodePlainText(plaintext) {
  plaintext = sanitize(plaintext);
  z = "";
  
  for (i = 0; i < plaintext.length; i++) {
    p = plaintext.charCodeAt(i) - 97;
    
    z = z + " " + p;
    
  }
  return z;
}

function getCodekey(key) {
  z = "";
  
  for (i = 0; i < plaintext.length; i++) {
    n = key.charCodeAt(i) - 97;
    
    z = z + " " + n;
    
  }
  return z;
}

function getCodeOutput(key) {
  z = "";
  
  for (i = 0; i < plaintext.length; i++) {
    n = key.charCodeAt(i) - 97;
    
    z = z + " " + n;
    
  }
  return z;
}


    

$(document).ready(function() {
  $("#encrypt").click(function() {
    plaintext = $("#plaintextInput").val();
    key = $("#keyEncryptInput").val();
    $("#output").text(columnarEncipher(plaintext, key));
    $("#output4").text(key.split('').join(' '));
    $("#output5").text(plaintext.split('').join(' '));
    $("#output6").text(getCodeOutput(columnarEncipher(plaintext, key)));
    //console.log(encrypt(plaintext, key));
  });

  $("#decrypt").click(function() {
    ciphertext = $("#ciphertextInput").val();
    key = $("#keyDecryptInput").val();
    $("#output").text(columnarDecipher(ciphertext, key));
    $("#output4").text(key.split('').join(' '));
    $("#output5").text(ciphertext.split('').join(' '));
    $("#output6").text(getCodeOutput(columnarDecipher(ciphertext, key)));
    //console.log(decrypt(ciphertext, key));
  });

});
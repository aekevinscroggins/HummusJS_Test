var async = require('async');
var fs = require('fs-extra');
var hummus = require('hummus');

function test(documentType, inputDocumentFilePath, outputDocumentFilePath, success, fail) {
	var pdfLogFilePath = "./PDFLog.txt";
//	var inputDocumentFilePath = "./test.pdf";
//	var outputDocumentFilePath = "./output.pdf";
	var signatureFilePath = "./signature.tif";
	var fontFilePath = "./OpenSans-Regular.ttf";
	var fontSize = 10;
	var spacing = 14.5;

	var defaultWhiteList = [
		"signature-2"
	];

	var formElements = [
		{
			name: "Signature 2",
			id: "signature-2",
			type: "signature",
			position: {
				x: 24,
				y: 271
			},
			size: {
				width: 980,
				height: 55
			}
		}
	];

	var formData = {
		"signature-2": signatureFilePath
	};

	console.log("Opening " + inputDocumentFilePath + " for reading and " + outputDocumentFilePath + " for writing...");

	var pdfWriter = hummus.createWriterToModify(
		inputDocumentFilePath,
		{
			modifiedFilePath: outputDocumentFilePath,
			log: pdfLogFilePath
		}
	);

	console.log("Creating PDF page modifier...");

	var pdfPageModifier = new hummus.PDFPageModifier(pdfWriter, 0);

	console.log("Obtained PDF context...");

	var pdfContext = pdfPageModifier.startContext().getContext();

	console.log("Setting up PDF font...");

	var pdfFont = {
		font: pdfWriter.getFontForFile(fontFilePath),
		size: fontSize,
		colorspace: 'gray',
		color: 0x00
	};

	console.log("Embedding form elements...");

	for(var i=0;i<formElements.length;i++) {
		if(defaultWhiteList != null) {
			var matchedID = false;

			for(var j=0;j<defaultWhiteList.length;j++) {
				if(defaultWhiteList[j].toLowerCase() == formElements[i].id) {
					matchedID = true;
					break;
				}
			}
			
			if(!matchedID) {
				continue;
			}
		}

		var value = formData[formElements[i].id];

		if(value == null || typeof value == "undefined") {
			console.error("Missing value for " + formattedFormID + " form element: \"" + formElements[i].name + "\"!");

			return fail("Internal document generation error!");
		}

		if(formElements[i].type == 'string' || formElements[i].type == 'number') {
			if(formElements[i].spaced) {
				for(var j=0;j<value.length;j++) {
					pdfContext.writeText(
						value[j],
						formElements[i].position.x + (j * spacing),
						formElements[i].position.y,
						pdfFont
					);
				}
			}
			else {
				pdfContext.writeText(
					value,
					formElements[i].position.x,
					formElements[i].position.y,
					pdfFont
				);
			}
		}
		else if(formElements[i].type == 'signature' || formElements[i].type == 'discounter-signature') {
			pdfContext.drawImage(
				formElements[i].position.x,
				formElements[i].position.y,
				value
			);
		}
	}

	console.log("Writing output document...");

	pdfPageModifier.endContext().writePage();

	console.log("Closing PDF writer...");

	pdfWriter.end();

	console.log(documentType + " document generated successfully!");

	return success();
}

module.exports = test;

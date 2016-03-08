var async = require('async');
var fs = require('fs-extra');
var hummus = require('hummus');
var imageMagick = require('imagemagick');

function test(documentType, inputDocumentFilePath, outputDocumentFilePath, success, fail) {
	var signatureDataEncoded = ["image/svg+xml;base64", "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMTgxIiBoZWlnaHQ9IjUwIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNIDEgOSBjIDAuMzIgLTAuMTQgMTQuMyAtOC4zMSAxOCAtOCBjIDIuMTkgMC4xOCA0LjgxIDYuODQgNiAxMCBjIDAuNjEgMS42MyAwLjQ2IDQuMTcgMCA2IGMgLTEuNDUgNS43OCAtMy44NSAxMy4yMiAtNiAxOCBjIC0wLjQxIDAuOTEgLTIuMTggMS4xOCAtMyAyIGMgLTMuNzIgMy43MiAtMTEgMTIgLTExIDEyIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTSA0NyAxNCBjIC0wLjMxIDAuMjYgLTExLjk5IDEwLjM1IC0xOCAxNSBjIC0xLjE1IDAuODkgLTIuNyAxLjcxIC00IDIgYyAtMS40NiAwLjMyIC0zLjY4IDAuNDQgLTUgMCBjIC0xLjMyIC0wLjQ0IC0zLjQ1IC0xLjkgLTQgLTMgYyAtMC41NSAtMS4xIC0wLjQ3IC0zLjg5IDAgLTUgYyAwLjM0IC0wLjggMi4wOCAtMS44NyAzIC0yIGMgMS4wNSAtMC4xNSAzLjE1IDAuMjEgNCAxIGMgMy43OCAzLjU1IDcuOTIgMTEuMzQgMTIgMTQgYyAyLjQ0IDEuNTkgNy41NSAxIDExIDEgYyAxLjI5IDAgMi44NyAtMC40NCA0IC0xIGMgMS4zNyAtMC42OCAyLjk5IC0xLjg1IDQgLTMgYyAxLjE4IC0xLjM1IDMgLTMuODIgMyAtNSBjIDAgLTAuODYgLTIuMTEgLTMuMDggLTMgLTMgYyAtMS44OCAwLjE3IC02LjA2IDIuNDQgLTggNCBjIC0wLjk3IDAuNzggLTEuNzEgMi43IC0yIDQgYyAtMC4zMiAxLjQ2IC0wLjYzIDQuMTIgMCA1IGMgMC42OCAwLjk1IDMuMzUgMS44NSA1IDIgYyA1LjIxIDAuNDcgMTIuNjcgMS40NCAxNyAwIGMgMy40MyAtMS4xNCA2LjYxIC02LjM0IDEwIC05IGMgMS4xMyAtMC44OCAyLjk0IC0yLjEyIDQgLTIgYyAxLjM4IDAuMTUgNC4xIDEuNjUgNSAzIGMgMi4wMSAzLjAyIDMuMjQgMTAuNCA1IDEyIGMgMC44NiAwLjc4IDQuNTEgLTAuODQgNiAtMiBjIDQgLTMuMTEgOC45MiAtMTAuODcgMTIgLTEyIGMgMS41NiAtMC41OCA1LjE1IDMuMTUgNyA1IGMgMS4yNSAxLjI1IDIuMjUgMy4zMSAzIDUgYyAwLjUzIDEuMTkgMC4zMyAzLjMzIDEgNCBjIDAuNjcgMC42NyAzLjA5IDEuNDIgNCAxIGMgMi4wNSAtMC45MyA1LjIxIC0zLjc3IDcgLTYgYyAyIC0yLjUgNC4wNCAtOS4yMSA1IC05IGMgMS4wOSAwLjI0IDIuMzMgMTAuMjMgNCAxMSBjIDEuNDcgMC42OCA2LjAxIC00LjEgOSAtNSBjIDMuMjEgLTAuOTYgOS4wNyAtMi4xIDExIC0xIGMgMS42NSAwLjk0IDEuODQgOC40OSAzIDkgYyAwLjk1IDAuNDIgMy45NCAtNC4xMiA2IC01IGMgMi4xMiAtMC45MSA1LjgzIC0xLjIgOCAtMSBjIDAuOTcgMC4wOSAyLjQ2IDEuMiAzIDIgbCAxIDQiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNIDE0MSAxNSBsIDEgMSIvPjwvc3ZnPg=="];
	var signatureDataXML = new Buffer(signatureDataEncoded[1], "base64").toString("ascii");
	var pdfLogFilePath = "./PDFLog.txt";
//	var inputDocumentFilePath = "./test.pdf";
//	var outputDocumentFilePath = "./output.pdf";
	var signatureXMLFilePath = "./signature.xml";
	var signatureImageFilePath = "./signature.tif";
	var fontFilePath = "./OpenSans-Regular.ttf";
	var fontSize = 10;
	var spacing = 14.5;

	var documentConfiguration = {
		"T1153": {
			fileName: "t1153-14e.pdf",
			md5: "10b290be6788a141fe23052de3efcb49",
			defaultWhiteList: [
				"signature"
			],
			elements: [
				{
					name: "Signature",
					id: "signature",
					type: "signature",
					position: {
						x: 220,
						y: 171
					},
					size: {
						width: 970,
						height: 98
					}
				}
			]
		},
		"T183": {
			fileName: "t183-15e.pdf",
			md5: "dec9d83f7d689e2af41db673edab9c8b",
			defaultWhiteList: [
				"signature"
			],
			elements: [
				{
					name: "Signature",
					id: "signature",
					type: "signature",
					position: {
						x: 24,
						y: 305
					},
					size: {
						width: 980,
						height: 55
					}
				}
			]
		},
		"RC71": {
			fileName: "rc71-15e.pdf",
			md5: "7caeb009152065a5e0e454ee263a428b",
			defaultWhiteList: [
				"signature"
			],
			elements: [
				{
					name: "Signature",
					id: "signature",
					type: "signature",
					position: {
						x: 20,
						y: 114
					},
					size: {
						width: 870,
						height: 240
					}
				}
			]
		},
		"T1013": {
			fileName: "t1013-15e.pdf",
			md5: "7f01710c7c0a2376c0671ea34893a417",
			defaultWhiteList: [
				"signature"
			],
			elements: [
				{
					name: "Signature",
					id: "signature",
					type: "signature",
					position: {
						x: 39,
						y: 378
					},
					size: {
						width: 600,
						height: 100
					}
				}
			]
		}
	};

	var formElements = documentConfiguration[documentType].elements;

	var signatureSize = formElements[0].size;

	async.waterfall(
		[
			function(callback) {
				console.log("Writing signature data to XML file.");

				fs.writeFile(
					signatureXMLFilePath,
					signatureDataXML,
					function(error) {
						if(error) {
							return callback(error);
						}

						return callback();
					}
				);
			},
			function(callback) {
				console.log("Converting signature to TIFF image with transparent background.");

				var signatureConverter = imageMagick.convert(
					[
						'-background',
						'transparent',
						'-type',
						'palette',
						'-depth',
						'8',
						'svg:-',
						'-resize',
						signatureSize.width + 'x' + signatureSize.height,
						'-compress',
						'lzw',
						'tif:-'
					],
					function(error, stdout, stderr) {
						if(error) {
							return callback("Failed to convert signature!");
						}
						else {
							fs.writeFile(
								signatureImageFilePath,
								stdout,
								'binary',
								function(error) {
									if(error) {
										return callback("Failed to save converted signature!");
									}
									else {
										return callback();
									}
								}
							);
						}
					}
				);

				signatureConverter.stdin.write(signatureDataXML);
				signatureConverter.stdin.end();
			},
			function(callback) {
				var defaultWhiteList = [
					"signature"
				];

				var formData = {
					"signature": signatureImageFilePath
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

				/*
				var image = pdfWriter.createFormXObjectFromTIFF(signatureImageFilePath);
				var imageMask = pdfWriter.createFormXObjectFromTIFF(
					signatureImageFilePath,
					{
						bwTreatment: {
							asImageMask: true,
							oneColor: [255,128,0]
						}
					}
				);

				pdfWriter.startPageContentContext(pdfPageModifier).q()
					.cm(1,0,0,1,0,842-195.12)
					.doXObject(image)
					.Q()
					.q()
					.cm(1,0,0,1,159.36,842-195.12)
					.rg(0,0,1)
					.re(0,0,159.36,195.12)
					.f()
					.doXObject(imageMask)
					.Q();
				*/

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
		],
		function(error) {
			if(error) {
				console.error(error);
			}
		}
	);
}

module.exports = test;

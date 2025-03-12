/*** Common CSS ***/
import { StyleSheet, Platform } from 'react-native';
import StyleConstant from './StyleConstant';

export default StyleSheet.create({

	/*** Position ***/

	positionRel: {
		position: "relative",
	},
	positionAbs: {
		position: "absolute",
	},

	/*** Top ***/
	top0: {
		top: 0,
	},
	top3: {
		top: 3,
	},
	top5: {
		top: (global.IS_IPAD ? 7 : 5),
	},
	top7: {
		top: (global.IS_IPAD ? 10 : 7),
	},
	top10: {
		top: 10,
	},
	top15: {
		top: (global.IS_IPAD ? 20 : 15),
	},
	top20: {
		top: 20,
	},
	top30: {
		top: 30,
	},
	top40: {
		top: 40,
	},
	top50: {
		top: 50,
	},
	top100: {
		top: 100,
	},
	top50pr: {
		top: "50%",
	},

	/*** Right ***/
	right0: {
		right: 0,
	},
	right5: {
		right: (global.IS_IPAD ? 7 : 5),
	},
	right7: {
		right: (global.IS_IPAD ? 10 : 7),
	},
	right10: {
		right: 10,
	},
	right15: {
		right: (global.IS_IPAD ? 20 : 15),
	},
	right20: {
		right: 20,
	},
	right30: {
		right: 30,
	},
	right40: {
		right: 40,
	},
	right50: {
		right: 50,
	},
	right60: {
		right: 60,
	},
	right50pr: {
		right: "50%",
	},

	/*** Bottom ***/
	bottom0: {
		bottom: 0,
	},
	bottom5: {
		bottom: 5,
	},
	bottom10: {
		bottom: (IS_IPAD ? 15 : 10),
	},
	bottom15: {
		bottom: 15,
	},
	bottom20: {
		bottom: (IS_IPAD ? 30 : 20),
	},
	bottom25: {
		bottom: (global.IS_IPAD ? 35 : 25),
	},
	bottom30: {
		bottom: 30,
	},
	bottom40: {
		bottom: 40,
	},
	bottom50: {
		bottom: 50,
	},
	bottom80: {
		bottom: 80,
	},
	bottom20pr: {
		bottom: "15%",
	},
	bottom50pr: {
		bottom: "50%",
	},

	/*** Left ***/
	left0: {
		left: 0,
	},
	left5: {
		left: (IS_IPAD ? 10 : 5),
	},
	left10: {
		left: (IS_IPAD ? 15 : 10),
	},
	left15: {
		left: 15,
	},
	left20: {
		left: 20,
	},
	left30: {
		left: 30,
	},
	left40: {
		left: 40,
	},
	left50: {
		left: 75,
	},
	left50pr: {
		left: "50%",
	},

	/*** Padding ***/

	paddingHorizontal0: {
		paddingHorizontal: 0
	},
	paddingHorizontal2: {
		paddingHorizontal: (global.IS_IPAD ? 4 : 2)
	},
	paddingHorizontal3: {
		paddingHorizontal: (global.IS_IPAD ? 5 : 3)
	},
	paddingHorizontal5: {
		paddingHorizontal: (global.IS_IPAD ? 10 : 5)
	},
	paddingHorizontal10: {
		paddingHorizontal: (global.IS_IPAD ? 15 : 10)
	},
	paddingHorizontal15: {
		paddingHorizontal: (global.IS_IPAD ? 20 : 15)
	},
	paddingHorizontal20: {
		paddingHorizontal: (global.IS_IPAD ? 30 : 20)
	},
	paddingHorizontal22: {
		paddingHorizontal: (global.IS_IPAD ? 35 : 22)
	},
	paddingHorizontal25: {
		paddingHorizontal: (global.IS_IPAD ? 40 : 25)
	},
	paddingHorizontal30: {
		paddingHorizontal: (global.IS_IPAD ? 50 : 30)
	},
	paddingHorizontal40: {
		paddingHorizontal: (global.IS_IPAD ? 70 : 40)
	},
	paddingHorizontal50: {
		paddingHorizontal: 50
	},
	paddingHorizontal55: {
		paddingHorizontal: (global.IS_IPAD ? 95 : 55)
	},
	paddingHorizontal60: {
		paddingHorizontal: (global.IS_IPAD ? 80 : 60)
	},
	paddingHorizontal80: {
		paddingHorizontal: (global.IS_IPAD ? 140 : 80)
	},

	paddingVertical0: {
		paddingVertical: 0
	},
	paddingVertical1: {
		paddingVertical: 1
	},
	paddingVertical3: {
		paddingVertical: (global.IS_IPAD ? 5 : 3)
	},
	paddingVertical5: {
		paddingVertical: (global.IS_IPAD ? 10 : 5)
	},
	paddingVertical7: {
		paddingVertical: (global.IS_IPAD ? 12 : 7)
	},
	paddingVertical10: {
		paddingVertical: (global.IS_IPAD ? 15 : 10)
	},
	paddingVertical12: {
		paddingVertical: (global.IS_IPAD ? 17 : 12)
	},
	paddingVertical15: {
		paddingVertical: (global.IS_IPAD ? 20 : 15)
	},
	paddingVertical20: {
		paddingVertical: 20
	},
	paddingVertical25: {
		paddingVertical: 25
	},
	paddingVertical30: {
		paddingVertical: (global.IS_IPAD ? 40 : 30)
	},
	paddingVertical40: {
		paddingVertical: 40
	},
	paddingVertical50: {
		paddingVertical: 50
	},

	paddingAuto: {
		padding: "auto"
	},
	padding0: {
		padding: 0
	},
	padding1: {
		padding: 1
	},
	padding2: {
		padding: 2
	},
	padding3: {
		padding: (global.IS_IPAD ? 5 : 3)
	},
	padding4: {
		padding: 4
	},
	padding5: {
		padding: (global.IS_IPAD ? 10 : 5)
	},
	padding7: {
		padding: 7
	},
	padding10: {
		padding: 10
	},
	padding15: {
		padding: 15
	},
	padding20: {
		padding: (global.IS_IPAD ? 30 : 20)
	},
	padding25: {
		padding: 25
	},
	padding30: {
		padding: 30
	},
	padding35: {
		padding: 35
	},
	padding40: {
		padding: 40
	},
	padding45: {
		padding: 45
	},
	padding50: {
		padding: 50
	},
	padding60: {
		padding: 60
	},
	padding70: {
		padding: 70
	},

	/*** Padding Top ***/

	paddingTop0: {
		paddingTop: 0
	},
	paddingTop1: {
		paddingTop: 1
	},
	paddingTop2: {
		paddingTop: 2
	},
	paddingTop3: {
		paddingTop: 3
	},
	paddingTop4: {
		paddingTop: 4
	},
	paddingTop5: {
		paddingTop: 5
	},
	paddingTop10: {
		paddingTop: (global.IS_IPAD ? 15 : 10)
	},
	paddingTop15: {
		paddingTop: 15
	},
	paddingTop20: {
		paddingTop: 20
	},
	paddingTop25: {
		paddingTop: 25
	},
	paddingTop30: {
		paddingTop: 30
	},
	paddingTop35: {
		paddingTop: 35
	},
	paddingTop40: {
		paddingTop: 40
	},
	paddingTop45: {
		paddingTop: 45
	},
	paddingTop50: {
		paddingTop: 50
	},
	paddingTop60: {
		paddingTop: 60
	},
	paddingTop70: {
		paddingTop: 70
	},


	/*** Padding Right ***/

	paddingRight0: {
		paddingRight: 0
	},
	paddingRight1: {
		paddingRight: 1
	},
	paddingRight2: {
		paddingRight: 2
	},
	paddingRight3: {
		paddingRight: 3
	},
	paddingRight4: {
		paddingRight: 4
	},
	paddingRight5: {
		paddingRight: 5
	},
	paddingRight7: {
		paddingRight: 7
	},
	paddingRight10: {
		paddingRight: 10
	},
	paddingRight15: {
		paddingRight: 15
	},
	paddingRight20: {
		paddingRight: 20
	},
	paddingRight25: {
		paddingRight: 25
	},
	paddingRight30: {
		paddingRight: (global.IS_IPAD ? 50 : 30)
	},
	paddingRight35: {
		paddingRight: 35
	},
	paddingRight40: {
		paddingRight: 40
	},
	paddingRight45: {
		paddingRight: 45
	},
	paddingRight50: {
		paddingRight: 50
	},
	paddingRight60: {
		paddingRight: 60
	},
	paddingRight70: {
		paddingRight: 70
	},

	/*** Padding Bottom ***/

	paddingBottom0: {
		paddingBottom: 0
	},
	paddingBottom1: {
		paddingBottom: 1
	},
	paddingBottom2: {
		paddingBottom: 2
	},
	paddingBottom3: {
		paddingBottom: 3
	},
	paddingBottom4: {
		paddingBottom: 4
	},
	paddingBottom5: {
		paddingBottom: (IS_IPAD ? 10 : 5)
	},
	paddingBottom10: {
		paddingBottom: (IS_IPAD ? 15 : 10)
	},
	paddingBottom15: {
		paddingBottom: 15
	},
	paddingBottom20: {
		paddingBottom: (IS_IPAD ? 40 : 20)
	},
	paddingBottom25: {
		paddingBottom: 25
	},
	paddingBottom30: {
		paddingBottom: (IS_IPAD ? 50 : 30)
	},
	paddingBottom35: {
		paddingBottom: (IS_IPAD ? 60 : 35)
	},
	paddingBottom40: {
		paddingBottom: (IS_IPAD ? 70 : 40)
	},
	paddingBottom45: {
		paddingBottom: 45
	},
	paddingBottom50: {
		paddingBottom: 50
	},
	paddingBottom60: {
		paddingBottom: 60
	},
	paddingBottom70: {
		paddingBottom: 70
	},

	/*** Padding Left ***/

	paddingLeft0: {
		paddingLeft: 0
	},
	paddingLeft1: {
		paddingLeft: 1
	},
	paddingLeft2: {
		paddingLeft: 2
	},
	paddingLeft3: {
		paddingLeft: 3
	},
	paddingLeft4: {
		paddingLeft: 4
	},
	paddingLeft5: {
		paddingLeft: (global.IS_IPAD ? 10 : 5)
	},
	paddingLeft10: {
		paddingLeft: (global.IS_IPAD ? 15 : 10)
	},
	paddingLeft15: {
		paddingLeft: (global.IS_IPAD ? 20 : 15)
	},
	paddingLeft20: {
		paddingLeft: 20
	},
	paddingLeft25: {
		paddingLeft: 25
	},
	paddingLeft30: {
		paddingLeft: 30
	},
	paddingLeft35: {
		paddingLeft: 35
	},
	paddingLeft40: {
		paddingLeft: 40
	},
	paddingLeft45: {
		paddingLeft: 45
	},
	paddingLeft50: {
		paddingLeft: 50
	},
	paddingLeft60: {
		paddingLeft: 60
	},
	paddingLeft70: {
		paddingLeft: 70
	},

	/*** Margin ***/

	marginHorizontal0: {
		marginHorizontal: 0
	},
	marginHorizontal5: {
		marginHorizontal: (global.IS_IPAD ? 10 : 5)
	},
	marginHorizontal10: {
		marginHorizontal: (global.IS_IPAD ? 15 : 10)
	},
	marginHorizontal15: {
		marginHorizontal: (global.IS_IPAD ? 20 : 15)
	},
	marginHorizontal20: {
		marginHorizontal: (global.IS_IPAD ? 30 : 20)
	},
	marginHorizontal25: {
		marginHorizontal: 25
	},
	marginHorizontal30: {
		marginHorizontal: (global.IS_IPAD ? 40 : 30)
	},
	marginHorizontal35: {
		marginHorizontal: (global.IS_IPAD ? 50 : 35)
	},
	marginHorizontal40: {
		marginHorizontal: (global.IS_IPAD ? 60 : 40)
	},
	marginHorizontal50: {
		marginHorizontal: 50
	},
	marginHorizontal60: {
		marginHorizontal: (global.IS_IPAD ? 80 : 60)
	},
	marginHorizontal80: {
		marginHorizontal: (global.IS_IPAD ? 140 : 80)
	},

	marginVertical0: {
		marginVertical: 0
	},
	marginVertical10: {
		marginVertical: (global.IS_IPAD ? 15 : 10)
	},
	marginVertical15: {
		marginVertical: 15
	},
	marginVertical20: {
		marginVertical: 20
	},
	marginVertical25: {
		marginVertical: 25
	},
	marginVertical30: {
		marginVertical: (global.IS_IPAD ? 40 : 30)
	},
	marginVertical40: {
		marginVertical: 40
	},
	marginVertical50: {
		marginVertical: 50
	},

	marginAuto: {
		margin: "auto"
	},
	margin0: {
		margin: 0
	},
	margin1: {
		margin: 1
	},
	margin2: {
		margin: 2
	},
	margin3: {
		margin: 3
	},
	margin4: {
		margin: 4
	},
	margin5: {
		margin: 5
	},
	margin10: {
		margin: (global.IS_IPAD ? 15 : 10)
	},
	margin15: {
		margin: 15
	},
	margin20: {
		margin: 20
	},
	margin25: {
		margin: 25
	},
	margin30: {
		margin: 30
	},
	margin35: {
		margin: 35
	},
	margin40: {
		margin: 40
	},
	margin45: {
		margin: 45
	},
	margin50: {
		margin: 50
	},

	/*** Margin Top ***/

	marginTop0: {
		marginTop: 0
	},
	marginTop1: {
		marginTop: 1
	},
	marginTop2: {
		marginTop: 2
	},
	marginTop3: {
		marginTop: 3
	},
	marginTop4: {
		marginTop: 4
	},
	marginTop5: {
		marginTop: (global.IS_IPAD ? 10 : 5)
	},
	marginTop7: {
		marginTop: (global.IS_IPAD ? 12 : 7)
	},
	marginTop8: {
		marginTop: (global.IS_IPAD ? 13 : 8)
	},
	marginTop10: {
		marginTop: (global.IS_IPAD ? 15 : 10)
	},
	marginTop12: {
		marginTop: (global.IS_IPAD ? 17 : 12)
	},
	marginTop13: {
		marginTop: (global.IS_IPAD ? 18 : 13)
	},
	marginTop15: {
		marginTop: (global.IS_IPAD ? 20 : 15)
	},
	marginTop20: {
		marginTop: (global.IS_IPAD ? 30 : 20)
	},
	marginTop25: {
		marginTop: (global.IS_IPAD ? 35 : 25)
	},
	marginTop30: {
		marginTop: (global.IS_IPAD ? 40 : 30)
	},
	marginTop35: {
		marginTop: (global.IS_IPAD ? 50 : 35)
	},
	marginTop40: {
		marginTop: (global.IS_IPAD ? 70 : 40)
	},
	marginTop45: {
		marginTop: 45
	},
	marginTop50: {
		marginTop: (global.IS_IPAD ? 80 : 50)
	},
	marginTop55: {
		marginTop: (global.IS_IPAD ? 75 : 55)
	},
	marginTop60: {
		marginTop: (global.IS_IPAD ? 90 : 60)
	},
	marginTop65: {
		marginTop: (global.IS_IPAD ? 95 : 65)
	},
	marginTop70: {
		marginTop: (global.IS_IPAD ? 100 : 70)
	},
	marginTop80: {
		marginTop: (global.IS_IPAD ? 120 : 80)
	},
	marginTop90: {
		marginTop: (global.IS_IPAD ? 140 : 90)
	},
	marginTop100: {
		marginTop: (global.IS_IPAD ? 160 : 100)
	},
	marginTop110: {
		marginTop: (global.IS_IPAD ? 170 : 110)
	},
	marginTop120: {
		marginTop: (global.IS_IPAD ? 180 : 120)
	},
	marginTop130: {
		marginTop: 130
	},
	marginTop140: {
		marginTop: (global.IS_IPAD ? 220 : 140)
	},
	marginTop150: {
		marginTop: (global.IS_IPAD ? 210 : 150)
	},
	marginTop200: {
		marginTop: (global.IS_IPAD ? 350 : 200)
	},
	marginTop250: {
		marginTop: (global.IS_IPAD ? 400 : 250)
	},
	marginTop300: {
		marginTop: (global.IS_IPAD ? 500 : 300)
	},
	marginTop40pr: {
		marginTop: "40%"
	},
	marginTop50pr: {
		marginTop: "50%"
	},
	marginTop60pr: {
		marginTop: "60%"
	},

	/*** Margin Right ***/
	marginRight0: {
		marginRight: 0
	},
	marginRight1: {
		marginRight: 1
	},
	marginRight2: {
		marginRight: 2
	},
	marginRight3: {
		marginRight: 3
	},
	marginRight4: {
		marginRight: 4
	},
	marginRight5: {
		marginRight: (global.IS_IPAD ? 10 : 5)
	},
	marginRight10: {
		marginRight: (global.IS_IPAD ? 15 : 10)
	},
	marginRight1205: {
		marginRight: (global.IS_IPAD ? 16 : 12.5)
	},
	marginRight15: {
		marginRight: (global.IS_IPAD ? 20 : 15)
	},
	marginRight20: {
		marginRight: 20
	},
	marginRight25: {
		marginRight: 25
	},
	marginRight30: {
		marginRight: 30
	},
	marginRight35: {
		marginRight: 35
	},
	marginRight40: {
		marginRight: (global.IS_IPAD ? 60 : 40)
	},
	marginRight45: {
		marginRight: (global.IS_IPAD ? 55 : 45)
	},
	marginRight50: {
		marginRight: (global.IS_IPAD ? 70 : 50)
	},
	marginRight100: {
		marginRight: (global.IS_IPAD ? 180 : 100)
	},

	/*** Margin Bottom ***/
	marginBottom0: {
		marginBottom: 0
	},
	marginBottom1: {
		marginBottom: 1
	},
	marginBottom2: {
		marginBottom: 2
	},
	marginBottom3: {
		marginBottom: (global.IS_IPAD ? 5 : 3)
	},
	marginBottom4: {
		marginBottom: (global.IS_IPAD ? 8 : 4)
	},
	marginBottom5: {
		marginBottom: (global.IS_IPAD ? 10 : 5)
	},
	marginBottom10: {
		marginBottom: (global.IS_IPAD ? 15 : 10)
	},
	marginBottom15: {
		marginBottom: (global.IS_IPAD ? 20 : 15)
	},
	marginBottom20: {
		marginBottom: 20
	},
	marginBottom25: {
		marginBottom: 25
	},
	marginBottom30: {
		marginBottom: (global.IS_IPAD ? 40 : 30)
	},
	marginBottom35: {
		marginBottom: 35
	},
	marginBottom40: {
		marginBottom: 40
	},
	marginBottom45: {
		marginBottom: 45
	},
	marginBottom50: {
		marginBottom: (global.IS_IPAD ? 80 : 50)
	},
	marginBottom60: {
		marginBottom: 60
	},
	marginBottom70: {
		marginBottom: (global.IS_IPAD ? 130 : 70)
	},
	marginBottom80: {
		marginBottom: (global.IS_IPAD ? 150 : 80)
	},
	marginBottom90: {
		marginBottom: (global.IS_IPAD ? 170 : 90)
	},
	marginBottom100: {
		marginBottom: (global.IS_IPAD ? 200 : 100)
	},
	marginBottom150: {
		marginBottom: (global.IS_IPAD ? 270 : 150)
	},
	marginBottom160: {
		marginBottom: (global.IS_IPAD ? 290 : 160)
	},
	marginBottom170: {
		marginBottom: (global.IS_IPAD ? 310 : 170)
	},
	marginBottom175: {
		marginBottom: (global.IS_IPAD ? 3120 : 175)
	},
	marginBottom180: {
		marginBottom: (global.IS_IPAD ? 330 : 180)
	},

	marginBottom20pr: {
		marginBottom: "20%"
	},
	marginBottom50pr: {
		marginBottom: "50%"
	},

	/*** Margin Left ***/
	marginLeft0: {
		marginLeft: 0
	},
	marginLeft1: {
		marginLeft: 1
	},
	marginLeft2: {
		marginLeft: 2
	},
	marginLeft3: {
		marginLeft: 3
	},
	marginLeft4: {
		marginLeft: 4
	},
	marginLeft5: {
		marginLeft: (global.IS_IPAD ? 10 : 5)
	},
	marginLeft7: {
		marginLeft: (global.IS_IPAD ? 12 : 7)
	},
	marginLeft10: {
		marginLeft: (global.IS_IPAD ? 15 : 10)
	},
	marginLeft1205: {
		marginLeft: (global.IS_IPAD ? 16 : 12.5)
	},
	marginLeft15: {
		marginLeft: (global.IS_IPAD ? 20 : 15)
	},
	marginLeft20: {
		marginLeft: (global.IS_IPAD ? 30 : 20)
	},
	marginLeft25: {
		marginLeft: (global.IS_IPAD ? 35 : 25)
	},
	marginLeft30: {
		marginLeft: (global.IS_IPAD ? 50 : 30)
	},
	marginLeft35: {
		marginLeft: 35
	},
	marginLeft40: {
		marginLeft: (global.IS_IPAD ? 60 : 40)
	},
	marginLeft45: {
		marginLeft: 45
	},
	marginLeft50: {
		marginLeft: (global.IS_IPAD ? 80 : 50)
	},

	/*** Flex ***/

	flexRow: {
		flexDirection: "row",
	},
	flexColumn: {
		flexDirection: "column",
	},

	flexWrap: {
		flexWrap: "wrap",
	},
	flexNoWrap: {
		flexWrap: "nowrap",
	},
	flexRevWrap: {
		flexWrap: "wrap-reverse",
	},

	flexGrow1: {
		flexGrow: 1,
	},
	flex00: {
		flex: 0,
	},
	flex005: {
		flex: 0.05,
	},
	flex01: {
		flex: 0.1,
	},
	flex015: {
		flex: 0.15,
	},
	flex02: {
		flex: 0.2,
	},
	flex025: {
		flex: 0.25,
	},
	flex03: {
		flex: 0.3,
	},
	flex033: {
		flex: 0.33,
	},
	flex04: {
		flex: 0.4,
	},
	flex05: {
		flex: 0.5,
	},
	flex06: {
		flex: 0.6,
	},
	flex07: {
		flex: 0.7,
	},
	flex08: {
		flex: 0.8,
	},
	flex085: {
		flex: 0.85,
	},
	flex09: {
		flex: 0.9,
	},
	flex095: {
		flex: 0.95,
	},
	flex1: {
		flex: 1,
	},

	/*** Alignment ***/

	justifyCenter: {
		justifyContent: "center",
	},
	justifyFStart: {
		justifyContent: "flex-start",
	},
	justifyFEnd: {
		justifyContent: "flex-end",
	},
	justifySAround: {
		justifyContent: "space-around",
	},
	justifySBetween: {
		justifyContent: "space-between",
	},
	justifySEvenly: {
		justifyContent: "space-evenly",
	},

	alignCntCenter: {
		alignContent: "center",
	},
	alignCntFStart: {
		alignContent: "flex-start",
	},
	alignCntFEnd: {
		alignContent: "flex-end",
	},
	alignCntSAround: {
		alignContent: "space-around",
	},
	alignCntSBetween: {
		alignContent: "space-between",
	},
	alignCntStretch: {
		alignContent: "stretch",
	},

	alignItmCenter: {
		alignItems: "center",
	},
	alignItmFStart: {
		alignItems: "flex-start",
	},
	alignItmFEnd: {
		alignItems: "flex-end",
	},
	alignItmBaseline: {
		alignItems: "baseline",
	},
	alignItmStretch: {
		alignItems: "stretch",
	},

	alignSlfAuto: {
		alignSelf: "auto",
	},
	alignSlfCenter: {
		alignSelf: "center",
	},
	alignSlfFStart: {
		alignSelf: "flex-start",
	},
	alignSlfFEnd: {
		alignSelf: "flex-end",
	},
	alignSlfBaseline: {
		alignSelf: "baseline",
	},
	alignSlfStretch: {
		alignSelf: "stretch",
	},

	/*** Border ***/

	border0: {
		borderWidth: 0,
	},
	border1: {
		borderWidth: 1,
	},
	border2: {
		borderWidth: 2,
	},
	border3: {
		borderWidth: 3,
	},
	border4: {
		borderWidth: 4,
	},
	border5: {
		borderWidth: 5,
	},
	border6: {
		borderWidth: 6,
	},
	border7: {
		borderWidth: 7,
	},
	border8: {
		borderWidth: 8,
	},
	border9: {
		borderWidth: 9,
	},
	border10: {
		borderWidth: 10,
	},

	/*** Border Top ***/

	borderTop0: {
		borderTopWidth: 0,
	},
	borderTop1: {
		borderTopWidth: 1,
	},
	borderTop2: {
		borderTopWidth: 2,
	},
	borderTop3: {
		borderTopWidth: 3,
	},
	borderTop4: {
		borderTopWidth: 4,
	},
	borderTop5: {
		borderTopWidth: 5,
	},
	borderTop6: {
		borderTopWidth: 6,
	},
	borderTop7: {
		borderTopWidth: 7,
	},
	borderTop8: {
		borderTopWidth: 8,
	},
	borderTop9: {
		borderTopWidth: 9,
	},
	borderTop10: {
		borderTopWidth: 10,
	},

	/*** Border Right ***/

	borderRight1: {
		borderRightWidth: 1,
	},
	borderRight2: {
		borderRightWidth: 2,
	},
	borderRight3: {
		borderRightWidth: 3,
	},
	borderRight4: {
		borderRightWidth: 4,
	},
	borderRight5: {
		borderRightWidth: 5,
	},
	borderRight6: {
		borderRightWidth: 6,
	},
	borderRight7: {
		borderRightWidth: 7,
	},
	borderRight8: {
		borderRightWidth: 8,
	},
	borderRight9: {
		borderRightWidth: 9,
	},
	borderRight10: {
		borderRightWidth: 10,
	},

	/*** Border Bottom ***/

	borderBottom0: {
		borderBottomWidth: 0,
	},
	borderBottom1: {
		borderBottomWidth: 1,
	},
	borderBottom2: {
		borderBottomWidth: 2,
	},
	borderBottom3: {
		borderBottomWidth: 3,
	},
	borderBottom4: {
		borderBottomWidth: 4,
	},
	borderBottom5: {
		borderBottomWidth: 5,
	},
	borderBottom6: {
		borderBottomWidth: 6,
	},
	borderBottom7: {
		borderBottomWidth: 7,
	},
	borderBottom8: {
		borderBottomWidth: 8,
	},
	borderBottom9: {
		borderBottomWidth: 9,
	},
	borderBottom10: {
		borderBottomWidth: 10,
	},

	/*** Border Left ***/

	borderLeft1: {
		borderLeftWidth: 1,
	},
	borderLeft2: {
		borderLeftWidth: 2,
	},
	borderLeft3: {
		borderLeftWidth: 3,
	},
	borderLeft4: {
		borderLeftWidth: 4,
	},
	borderLeft5: {
		borderLeftWidth: 5,
	},
	borderLeft6: {
		borderLeftWidth: 6,
	},
	borderLeft7: {
		borderLeftWidth: 7,
	},
	borderLeft8: {
		borderLeftWidth: 8,
	},
	borderLeft9: {
		borderLeftWidth: 9,
	},
	borderLeft10: {
		borderLeftWidth: 10,
	},

	/*** Border Radius ***/
	borderRadius1: {
		borderRadius: 1
	},
	borderRadius2: {
		borderRadius: (global.IS_IPAD ? 4 : 2),
	},
	borderRadius3: {
		borderRadius: 3
	},
	borderRadius4: {
		borderRadius: (global.IS_IPAD ? 10 : 5)
	},
	borderRadius5: {
		borderRadius: (global.IS_IPAD ? 10 : 5),
	},
	borderRadius6: {
		borderRadius: 6
	},
	borderRadius7: {
		borderRadius: 7
	},
	borderRadius075: {
		borderRadius: (global.IS_IPAD ? 10 : 7.5)
	},
	borderRadius8: {
		borderRadius: (global.IS_IPAD ? 15 : 8)
	},
	borderRadius9: {
		borderRadius: 9
	},
	borderRadius10: {
		borderRadius: (global.IS_IPAD ? 15 : 10)
	},
	borderRadius1205: {
		borderRadius: (global.IS_IPAD ? 17.5 : 12.5)
	},
	borderRadius13: {
		borderRadius: (global.IS_IPAD ? 18 : 13)
	},
	borderRadius15: {
		borderRadius: (global.IS_IPAD ? 20 : 15)
	},
	borderRadius1705: {
		borderRadius: (global.IS_IPAD ? 22.5 : 17.5)
	},
	borderRadius20: {
		borderRadius: (global.IS_IPAD ? 30 : 20)
	},
	borderRadius2205: {
		borderRadius: (global.IS_IPAD ? 32.5 : 22.5)
	},
	borderRadius23: {
		borderRadius: (global.IS_IPAD ? 34 : 23)
	},
	borderRadius25: {
		borderRadius: (global.IS_IPAD ? 40 : 25)
	},
	borderRadius28: {
		borderRadius: (global.IS_IPAD ? 38 : 28)
	},
	borderRadius30: {
		borderRadius: (global.IS_IPAD ? 50 : 30)
	},
	borderRadius40: {
		borderRadius: (global.IS_IPAD ? 60 : 40)
	},
	borderRadius50: {
		borderRadius: (global.IS_IPAD ? 80 : 50),
	},
	borderRadius70: {
		borderRadius: (global.IS_IPAD ? 100 : 70),
	},
	borderRadius75: {
		borderRadius: (global.IS_IPAD ? 105 : 75),
	},
	borderRadius100: {
		borderRadius: (global.IS_IPAD ? 170 : 100)
	},
	borderRadius150: {
		borderRadius: (global.IS_IPAD ? 200 : 150),
	},

	/*** Border Top Radius ***/
	borderTopRadius1: {
		borderTopRightRadius: 1,
		borderTopLeftRadius: 1
	},
	borderTopRadius2: {
		borderTopRightRadius: (global.IS_IPAD ? 4 : 2),
		borderTopLeftRadius: (global.IS_IPAD ? 4 : 2),
	},
	borderTopRadius3: {
		borderTopRightRadius: 3,
		borderTopLeftRadius: 3,
	},
	borderTopRadius4: {
		borderTopRightRadius: 4,
		borderTopLeftRadius: 4,
	},
	borderTopRadius5: {
		borderTopRightRadius: (global.IS_IPAD ? 10 : 5),
		borderTopLeftRadius: (global.IS_IPAD ? 10 : 5),
	},
	borderTopRadius6: {
		borderTopRightRadius: 6,
		borderTopLeftRadius: 6,
	},
	borderTopRadius7: {
		borderTopRightRadius: 7,
		borderTopLeftRadius: 7,
	},
	borderTopRadius075: {
		borderTopRightRadius: (global.IS_IPAD ? 10 : 7.5),
		borderTopLeftRadius: (global.IS_IPAD ? 10 : 7.5),
	},
	borderTopRadius8: {
		borderTopRightRadius: (global.IS_IPAD ? 15 : 8),
		borderTopLeftRadius: (global.IS_IPAD ? 15 : 8),
	},
	borderTopRadius9: {
		borderTopRightRadius: 9,
		borderTopLeftRadius: 9,
	},
	borderTopRadius10: {
		borderTopRightRadius: (global.IS_IPAD ? 15 : 10),
		borderTopLeftRadius: (global.IS_IPAD ? 15 : 10),
	},
	borderTopRadius1205: {
		borderTopRightRadius: (global.IS_IPAD ? 17.5 : 12.5),
		borderTopLeftRadius: (global.IS_IPAD ? 17.5 : 12.5),
	},
	borderTopRadius13: {
		borderTopRightRadius: (global.IS_IPAD ? 18 : 13),
		borderTopLeftRadius: (global.IS_IPAD ? 18 : 13),
	},
	borderTopRadius15: {
		borderTopRightRadius: (global.IS_IPAD ? 20 : 15),
		borderTopLeftRadius: (global.IS_IPAD ? 20 : 15),
	},
	borderTopRadius1705: {
		borderTopRightRadius: (global.IS_IPAD ? 22.5 : 17.5),
		borderTopLeftRadius: (global.IS_IPAD ? 22.5 : 17.5)
	},
	borderTopRadius20: {
		borderTopRightRadius: (global.IS_IPAD ? 30 : 20),
		borderTopLeftRadius: (global.IS_IPAD ? 30 : 20),
	},
	borderTopRadius2205: {
		borderTopRightRadius: (global.IS_IPAD ? 32.5 : 22.5),
		borderTopLeftRadius: (global.IS_IPAD ? 32.5 : 22.5),
	},
	borderTopRadius23: {
		borderTopRightRadius: (global.IS_IPAD ? 34 : 23),
		borderTopLeftRadius: (global.IS_IPAD ? 34 : 23),
	},
	borderTopRadius25: {
		borderTopRightRadius: (global.IS_IPAD ? 40 : 25),
		borderTopLeftRadius: (global.IS_IPAD ? 40 : 25),
	},
	borderTopRadius30: {
		borderTopRightRadius: (global.IS_IPAD ? 50 : 30),
		borderTopLeftRadius: (global.IS_IPAD ? 50 : 30),
	},
	borderTopRadius50: {
		borderTopRightRadius: (global.IS_IPAD ? 90 : 50),
		borderTopLeftRadius: (global.IS_IPAD ? 90 : 50),
	},
	borderTopRadius100: {
		borderTopRightRadius: 100,
		borderTopLeftRadius: 100,
	},

	/*** Border Bottom Radius ***/
	borderBttomRadius1: {
		borderBottomRightRadius: 1,
		borderBottomLeftRadius: 1
	},
	borderBttomRadius2: {
		borderBottomRightRadius: (global.IS_IPAD ? 4 : 2),
		borderBottomLeftRadius: (global.IS_IPAD ? 4 : 2),
	},
	borderBttomRadius3: {
		borderBottomRightRadius: 3,
		borderBottomLeftRadius: 3,
	},
	borderBttomRadius4: {
		borderBottomRightRadius: 4,
		borderBottomLeftRadius: 4,
	},
	borderBttomRadius5: {
		borderBottomRightRadius: (global.IS_IPAD ? 10 : 5),
		borderBottomLeftRadius: (global.IS_IPAD ? 10 : 5),
	},
	borderBttomRadius6: {
		borderBottomRightRadius: 6,
		borderBottomLeftRadius: 6,
	},
	borderBttomRadius7: {
		borderBottomRightRadius: 7,
		borderBottomLeftRadius: 7,
	},
	borderBttomRadius075: {
		borderBottomRightRadius: (global.IS_IPAD ? 10 : 7.5),
		borderBottomLeftRadius: (global.IS_IPAD ? 10 : 7.5),
	},
	borderBttomRadius8: {
		borderBottomRightRadius: (global.IS_IPAD ? 15 : 8),
		borderBottomLeftRadius: (global.IS_IPAD ? 15 : 8),
	},
	borderBttomRadius9: {
		borderBottomRightRadius: 9,
		borderBottomLeftRadius: 9,
	},
	borderBttomRadius10: {
		borderBottomRightRadius: (global.IS_IPAD ? 15 : 10),
		borderBottomLeftRadius: (global.IS_IPAD ? 15 : 10),
	},
	borderBttomRadius1205: {
		borderBottomRightRadius: (global.IS_IPAD ? 17.5 : 12.5),
		borderBottomLeftRadius: (global.IS_IPAD ? 17.5 : 12.5),
	},
	borderBttomRadius13: {
		borderBottomRightRadius: (global.IS_IPAD ? 18 : 13),
		borderBottomLeftRadius: (global.IS_IPAD ? 18 : 13),
	},
	borderBttomRadius15: {
		borderBottomRightRadius: (global.IS_IPAD ? 20 : 15),
		borderBottomLeftRadius: (global.IS_IPAD ? 20 : 15),
	},
	borderBttomRadius1705: {
		borderBottomRightRadius: (global.IS_IPAD ? 22.5 : 17.5),
		borderBottomLeftRadius: (global.IS_IPAD ? 22.5 : 17.5)
	},
	borderBttomRadius20: {
		borderBottomRightRadius: (global.IS_IPAD ? 30 : 20),
		borderBottomLeftRadius: (global.IS_IPAD ? 30 : 20),
	},
	borderBttomRadius2205: {
		borderBottomRightRadius: (global.IS_IPAD ? 32.5 : 22.5),
		borderBottomLeftRadius: (global.IS_IPAD ? 32.5 : 22.5),
	},
	borderBttomRadius23: {
		borderBottomRightRadius: (global.IS_IPAD ? 34 : 23),
		borderBottomLeftRadius: (global.IS_IPAD ? 34 : 23),
	},
	borderBttomRadius25: {
		borderBottomRightRadius: (global.IS_IPAD ? 40 : 25),
		borderBottomLeftRadius: (global.IS_IPAD ? 40 : 25),
	},
	borderBttomRadius30: {
		borderBottomRightRadius: (global.IS_IPAD ? 50 : 30),
		borderBottomLeftRadius: (global.IS_IPAD ? 50 : 30),
	},
	borderBttomRadius50: {
		borderBottomRightRadius: (global.IS_IPAD ? 90 : 50),
		borderBottomLeftRadius: (global.IS_IPAD ? 90 : 50),
	},
	borderBttomRadius100: {
		borderBottomRightRadius: 100,
		borderBottomLeftRadius: 100,
	},

	/*** Height ***/
	heightAuto: {
		height: "auto",
	},
	height1: {
		height: 1,
	},
	height2: {
		height: (global.IS_IPAD ? 4 : 2),
	},
	height3: {
		height: (global.IS_IPAD ? 5 : 3),
	},
	height4: {
		height: (global.IS_IPAD ? 6 : 4),
	},
	height5: {
		height: (global.IS_IPAD ? 10 : 5),
	},
	height7: {
		height: (global.IS_IPAD ? 10 : 7),
	},
	height10: {
		height: (global.IS_IPAD ? 15 : 10),
	},
	height15: {
		height: (global.IS_IPAD ? 20 : 15),
	},
	height20: {
		height: (global.IS_IPAD ? 30 : 20),
	},
	height25: {
		height: (global.IS_IPAD ? 35 : 25),
	},
	height28: {
		height: (global.IS_IPAD ? 38 : 28),
	},
	height30: {
		height: (global.IS_IPAD ? 40 : 30),
	},
	height35: {
		height: (global.IS_IPAD ? 50 : 35),
	},
	height38: {
		height: (global.IS_IPAD ? 55 : 38),
	},
	height40: {
		height: (global.IS_IPAD ? 70 : 40),
	},
	height45: {
		height: (global.IS_IPAD ? 55 : 45),
	},
	height46: {
		height: (global.IS_IPAD ? 92 : 46),
	},
	height50: {
		height: (global.IS_IPAD ? 80 : 50),
	},
	height60: {
		height: (global.IS_IPAD ? 90 : 60),
	},
	height70: {
		height: (global.IS_IPAD ? 100 : 70),
	},
	height75: {
		height: (global.IS_IPAD ? 105 : 75),
	},
	height80: {
		height: 80,
	},
	height80pr: {
		height: "80%",
	},
	height90: {
		height: 90,
	},
	height90pr: {
		height: "90%",
	},
	height100pr: {
		height: "100%",
	},
	height100: {
		height: (global.IS_IPAD ? 170 : 100),
	},
	height120: {
		height: (global.IS_IPAD ? 200 : 120)
	},
	height150: {
		height: (global.IS_IPAD ? 200 : 150),
	},
	height200: {
		height: (global.IS_IPAD ? 300 : 200),
	},
	height230: {
		height: (global.IS_IPAD ? 350 : 230),
	},
	height250: {
		height: (global.IS_IPAD ? 400 : 250),
	},
	height350: {
		height: (global.IS_IPAD ? 500 : 350),
	},
	height500: {
		height: 500,
	},


	/*** Width ***/
	widthAuto: {
		width: "auto",
	},
	width4: {
		width: (global.IS_IPAD ? 6 : 4),
	},
	width5: {
		width: (global.IS_IPAD ? 10 : 5),
	},
	width10: {
		width: 10,
	},
	width10pr: {
		width: '10%',
	},
	width15: {
		width: (global.IS_IPAD ? 20 : 15),
	},
	width20: {
		width: (global.IS_IPAD ? 30 : 20),
	},
	width25: {
		width: (global.IS_IPAD ? 35 : 25),
	},
	width30: {
		width: (global.IS_IPAD ? 40 : 30),
	},
	width35: {
		width: 35,
	},
	width38: {
		width: (global.IS_IPAD ? 55 : 38),
	},
	width40: {
		width: (global.IS_IPAD ? 60 : 40),
	},
	width45: {
		width: (global.IS_IPAD ? 55 : 45),
	},
	width50: {
		width: (global.IS_IPAD ? 80 : 50),
	},
	width60: {
		width: (global.IS_IPAD ? 90 : 60)
	},
	width70: {
		width: (global.IS_IPAD ? 100 : 70),
	},
	width75: {
		width: (global.IS_IPAD ? 105 : 75),
	},
	width80: {
		width: 80,
	},
	width90: {
		width: (global.IS_IPAD ? 150 : 90)
	},
	width100: {
		width: (global.IS_IPAD ? 170 : 100)
	},
	width110: {
		width: (global.IS_IPAD ? 190 : 110)
	},
	width120: {
		width: (global.IS_IPAD ? 200 : 120)
	},
	width150: {
		width: (global.IS_IPAD ? 200 : 150)
	},
	width160: {
		width: (global.IS_IPAD ? 220 : 160)
	},
	width180: {
		width: (global.IS_IPAD ? 260 : 180)
	},
	width200: {
		width: (global.IS_IPAD ? 300 : 200),
	},
	width230: {
		width: (global.IS_IPAD ? 330 : 230),
	},
	width250: {
		width: (global.IS_IPAD ? 350 : 250),
	},
	width280: {
		width: (global.IS_IPAD ? 400 : 280)
	},
	width70pr: {
		width: "70%",
	},
	width100pr: {
		width: "100%",
	},
	width20pr: {
		width: "20%",
	},
	width25pr: {
		width: "25%",
	},
	width30pr: {
		width: "30%",
	},
	width33pr: {
		width: "33.33%",
	},
	width40pr: {
		width: "40%",
	},
	width50pr: {
		width: "50%",
	},
	width60pr: {
		width: "60%",
	},
	width70pr: {
		width: "70%",
	},
	width75pr: {
		width: "75%",
	},
	width80pr: {
		width: "80%",
	},
	width90pr: {
		width: "90%",
	},
	width95pr: {
		width: "95%",
	},

	/*** Opacity Style ***/
	opacity01: {
		opacity: 0.1
	},
	opacity02: {
		opacity: 0.2
	},
	opacity03: {
		opacity: 0.3
	},
	opacity04: {
		opacity: 0.4
	},
	opacity05: {
		opacity: 0.5
	},
	opacity06: {
		opacity: 0.6
	},
	opacity07: {
		opacity: 0.7
	},
	opacity08: {
		opacity: 0.8
	},
	opacity09: {
		opacity: 0.9
	},

	/*** Other Style ***/

	zIndex9: {
		zIndex: 9,
	},
	zIndex99: {
		zIndex: 99,
	},
	zIndex999: {
		zIndex: 999,
	},
	zIndex9999: {
		zIndex: 9999,
	},
	displayFlex: {
		display: "flex",
	},
	displayNone: {
		display: "none",
	},
	overflowHidden: {
		overflow: "hidden",
	},
	overflowScroll: {
		overflow: "scroll",
	},
	overflowVisible: {
		overflow: "visible",
	},

	textDecorationUnderLine: {
		textDecorationLine: 'underline'
	},

	mapStyle: {
		height: 400,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},

	/*** Image Style ***/
	imageContain: {
		resizeMode: 'contain'
	},

});
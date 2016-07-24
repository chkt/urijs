import _assert from 'assert';

import URIComponent from '../source/URIComponent';



describe('URIComponent', () => {
	describe('.ComponentString', () => {
		it("should return an initialized instance");
		it("should require a valid component type as first argument");
		it("should accept a string as optional second argument");
		it("should accept an URIComponent as optional third argument");
		it("should return the reinitialized third argument if provided");
	});

	describe('.URIString', () => {
		it("should return an initialized instance");
		it("should require a valid component type as first argument");
		it("should require a valid uri string as second argument");
		it("should accept an URIComponent as optional third argument");
		it("should return the reinitialized third argument if provided");
	});

	describe(".copy", () => {
		it("should require an URIComponent as first argument");
		it("should return an initialized URIComponent as a copy of the first argument");
		it("should accept an URIComponent as optional second argument");
		it("should return the second argument if provided");
	});

	describe(".isEQ", () => {
		it("should require URIComponents as first and second argument");
		it("should return true if both URIComponents have the same type and encoded string");
	});

	describe('#constructor', () => {
		it("should require a valid component type as first argument");
		it("should accept a string as optional second argument");
		it("should create a new instance");
	});

	describe('#type', () => {
		it("should get the component type of the instance");
		it("should not be settable");
	});

	describe('#string', () => {
		it("should get the encoded component");
		it("should set the encoded component");
		it("should only set valid scheme components when component type is scheme");
		it("should correctly encode scheme components when component type is scheme");
		it("should only set valid user components when component type is user");
		it("should correctly encode user components when component type is user");
		it("should only set valid name components when component type is name");
		it("should correctly encode name components when component type is name");
		it("should only set valid port components when component type is port");
		it("should correctly encode port components when component type is port");
		it("should only set valid path components when component type is path");
		it("should correctly encode path components when component type is path");
		it("should only set valid query components when component type is query");
		it("should correctly encode query component when component type is query");
		it("should only set valid fragment components when component type is fragment");
		it("should correctly encode fragment components when component type is fragment");
	});

	describe('#stringDecoded', () => {
		it("should get the decoded component without decoded segment separators");
		it("should set the decoded component without decoded segment separators");
	});

	describe("#empty", () => {
		it("should get the empty state of the component");
		it("should not be settable");
	});

	describe('#define', () => {
		it("should reinitialize the instance");
		it("should require a valid component type as first argument");
		it("should accept a string as optional second argument");
		it("should return the instance");
	});

	describe('#copyOf', () => {
		it("should require a URIComponent as argument");
		it("should reinitialize the instance as a copy of the argument");
		it("should return the instance");
	});

	describe('#toString', () => {
		it("should return the encoded component");
	});
});

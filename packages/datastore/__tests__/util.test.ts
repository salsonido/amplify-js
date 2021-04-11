import {
	objectsEqual,
	isAWSDate,
	isAWSDateTime,
	isAWSEmail,
	isAWSTime,
	isAWSTimestamp,
	isAWSJSON,
	isAWSURL,
	isAWSPhone,
	isAWSIPAddress,
} from '../src/util';

describe('datastore util', () => {
	test('objectsEqual', () => {
		expect(objectsEqual({}, {})).toEqual(true);
		expect(objectsEqual([], [])).toEqual(true);
		expect(objectsEqual([], {})).toEqual(false);
		expect(objectsEqual([1, 2, 3], [1, 2, 3])).toEqual(true);
		expect(objectsEqual([1, 2, 3], [1, 2, 3, 4])).toEqual(false);
		expect(objectsEqual({ a: 1 }, { a: 1 })).toEqual(true);
		expect(objectsEqual({ a: 1 }, { a: 2 })).toEqual(false);
		expect(
			objectsEqual({ a: [{ b: 2 }, { c: 3 }] }, { a: [{ b: 2 }, { c: 3 }] })
		).toEqual(true);
		expect(
			objectsEqual({ a: [{ b: 2 }, { c: 3 }] }, { a: [{ b: 2 }, { c: 4 }] })
		).toEqual(false);
		expect(objectsEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toEqual(true);
		expect(objectsEqual(new Set([1, 2, 3]), new Set([1, 2, 3, 4]))).toEqual(
			false
		);

		const map1 = new Map();
		map1.set('a', 1);

		const map2 = new Map();
		map2.set('a', 1);

		expect(objectsEqual(map1, map2)).toEqual(true);
		map2.set('b', 2);
		expect(objectsEqual(map1, map2)).toEqual(false);

		// nullish - treat null and undefined as equal in Objects and Maps
		expect(objectsEqual({ a: 1, b: null }, { a: 1 }, true)).toEqual(true);
		expect(
			objectsEqual({ a: 1, b: null }, { a: 1, b: undefined }, true)
		).toEqual(true);
		expect(objectsEqual({ a: 1, b: false }, { a: 1 }, true)).toEqual(false);

		const map3 = new Map();
		map3.set('a', null);
		const map4 = new Map();

		expect(objectsEqual(map3, map4, true)).toEqual(true);

		const map5 = new Map();
		map5.set('a', false);
		const map6 = new Map();

		expect(objectsEqual(map5, map6, true)).toEqual(false);

		// should not attempt nullish comparison for arrays/sets
		expect(objectsEqual([null], [], true)).toEqual(false);
		expect(objectsEqual([null], [undefined], true)).toEqual(false);
		expect(objectsEqual(new Set([null]), new Set([]), true)).toEqual(false);
		expect(objectsEqual(new Set([null]), new Set([undefined]), true)).toEqual(
			false
		);

		// should return false for non-object types
		expect(objectsEqual(null, undefined)).toEqual(false);
		expect(objectsEqual(null, undefined, true)).toEqual(false);

		expect(objectsEqual(undefined, undefined)).toEqual(false);
		expect(objectsEqual(undefined, undefined, true)).toEqual(false);

		expect(objectsEqual(null, null)).toEqual(false);
		expect(objectsEqual(null, null, true)).toEqual(false);

		expect(objectsEqual('string' as any, 'string' as any)).toEqual(false);
		expect(objectsEqual('string' as any, 'string' as any, true)).toEqual(false);

		expect(objectsEqual(123 as any, 123 as any)).toEqual(false);
		expect(objectsEqual(123 as any, 123 as any, true)).toEqual(false);

		expect(objectsEqual(true as any, true as any)).toEqual(false);
		expect(objectsEqual(true as any, true as any, true)).toEqual(false);
	});

	test('isAWSDate', () => {
		const valid = [
			'2020-01-01',
			'1979-01-01Z',
			'2021-01-01+05:30',
			'2021-01-01-05:30:12',
		];
		const invalid = [
			'',
			'2021-01-1',
			'201-01-50',
			'2021-01-112',
			'2021-01-01+5:30',
			'2021-01-01+05:3',
			'2021-01-01+05:3.',
			'2021-01-01-05:30:12Z',
			// '2021-99-99',
			// '2021-01-21+99:02'
		];
		valid.forEach(test => {
			expect(isAWSDate(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSDate(test)).toBe(false);
		});
	});

	test('isAWSTime', () => {
		const valid = [
			'12:30',
			'12:30Z',
			'12:30:24Z',
			'12:30:24.1Z',
			'12:30:24.12Z',
			'12:30:24.123Z',
			'12:30:24.1234Z',
			'12:30:24-07:00',
			'12:30:24.500+05:30',
			'12:30:24.500+05:30:00',
		];
		const invalid = [
			'',
			'1:30',
			'12:30.Z',
			'120:30:242Z',
			'12:30:242Z',
			'12:30:24-07:00Z',
			'12:30:24.500+05:3',
			'12:30.500+05:30',
			'12:30:.500Z',
			'12:30:24.500+5:30:00',
		];
		valid.forEach(test => {
			expect(isAWSTime(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSTime(test)).toBe(false);
		});
	});

	test('isAWSDateTime', () => {
		const valid = [
			'2021-01-11T12:30',
			'2021-01-11T12:30Z',
			'2021-01-11T12:30:24Z',
			'2021-01-11T12:30:24.5Z',
			'2021-01-11T12:30:24.50Z',
			'2021-01-11T12:30:24.500Z',
			'2021-01-11T12:30:24.5000Z',
			'2021-02-09T06:19:04.49Z',
			'2021-01-11T12:30:24-07:00',
			'2021-01-11T12:30:24.500+05:30',
			'2021-01-11T12:30:24.500+05:30:00',
		];
		const invalid = [
			'',
			'2021-01-11T1:30',
			'2021-01-11T12:30.Z',
			'2021-01-11T120:30:242Z',
			'2021-01-11T12:30:242Z',
			'2021-01-11T12:30:24-07:00Z',
			'2021-01-11T12:30:24.500+05:3',
			'2021-01-11T12:30.500+05:30',
			'2021-01-11T12:30:.500Z',
			'2021-01-11T12:30:24.500+5:30:00',
			'2021-1-11T12:30Z',
			'2021-01-11T1:30Z',
			'2021-01-11T1:3',
			'20211-01-11T12:30:.500Z',
		];
		valid.forEach(test => {
			expect(isAWSDateTime(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSDateTime(test)).toBe(false);
		});
	});

	test('isAWSTimestamp', () => {
		const valid = [0, 123, 123456, 123456789];
		const invalid = [-1, -123, -123456, -1234567];
		valid.forEach(test => {
			expect(isAWSTimestamp(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSTimestamp(test)).toBe(false);
		});
	});

	test('isAWSEmail', () => {
		const valid = ['a@b', 'a@b.c', 'john@doe.com'];
		const invalid = [
			'',
			'@',
			'a',
			'a@',
			'a@@',
			'@a',
			'@@',
			'a @b.c',
			'a@ b.c',
			'a@b. c',
		];
		valid.forEach(test => {
			expect(isAWSEmail(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSEmail(test)).toBe(false);
		});
	});

	test('isAWSJSON', () => {
		const valid = [
			'{"upvotes": 10}',
			'{}',
			'[1,2,3]',
			'[]',
			'"AWSJSON example string"',
			'1',
			'0',
			'-1',
			'true',
			'false',
		];
		const invalid = [
			'',
			'#',
			'2020-01-01',
			'{a: 1}',
			'{‘a’: 1}',
			'Unquoted string',
		];
		valid.forEach(test => {
			expect(isAWSJSON(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSJSON(test)).toBe(false);
		});
	});

	test('isAWSURL', () => {
		const valid = ['http://localhost/', 'schema://anything', 'smb://a/b/c?d=e'];
		const invalid = ['', '//', '//example', 'example'];
		valid.forEach(test => {
			expect(isAWSURL(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSURL(test)).toBe(false);
		});
	});

	test('isAWSPhone', () => {
		const valid = [
			'+10000000000',
			'+100 00 00',
			'000 00000',
			'123-456-7890',
			'+44123456789',
		];
		const invalid = ['', '+', '+-', 'a', 'bad-number'];
		valid.forEach(test => {
			expect(isAWSPhone(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSPhone(test)).toBe(false);
		});
	});

	test('isAWSIPAddress', () => {
		const valid = [
			'127.0.0.1',
			'123.123.123.123',
			'1.1.1.1',
			'::',
			'::1',
			'2001:db8:a0b:12f0::1',
			'::ffff:10.0.0.1',
			'0064:ff9b:0000:0000:0000:0000:1234:5678',
		];
		const invalid = [
			'',
			' ',
			':',
			'1.',
			'test',
			'999.1.1.1',
			' 1.1.1.1',
			'1.1.1.1 ',
			'-1.1.1.1',
			'1111.111.111.111',
			'1.0.0',
			'::1 ',
			'::ffff:10.0.0',
			' ::ffff:10.0.0',
		];
		valid.forEach(test => {
			expect(isAWSIPAddress(test)).toBe(true);
		});
		invalid.forEach(test => {
			expect(isAWSIPAddress(test)).toBe(false);
		});
	});
});

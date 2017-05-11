define(function vectors () {
	return [
		{ item: 'script tags', dirty: '<script>alert("hack")</script>', clean: '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;' },
		{ item: 'video tags', dirty: '<video/src="x"onloadstart="prompt()">', clean: '&lt;video&#x2F;src&#x3D;&quot;x&quot;onloadstart&#x3D;&quot;prompt()&quot;&gt;' },
		{ item: 'tags', dirty: 'foo<&"\'>', clean: 'foo&lt;&amp;&quot;&#39;&gt;' },
		{ item: 'equals', dirty: 'foo=', clean: 'foo&#x3D;' }
	];
});

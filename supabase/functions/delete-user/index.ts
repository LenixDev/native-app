import '@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async req => {
	const authHeader = req.headers.get('Authorization')

	if (!authHeader) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
		})
	}

	const adminClient = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	)

	const userClient = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_ANON_KEY')!,
		{ global: { headers: { Authorization: authHeader } } },
	)

	const {
		data: { user },
		error,
	} = await userClient.auth.getUser()

	if (error || !user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
		})
	}

	const { error: deleteError } = await adminClient.auth.admin.deleteUser(
		user.id,
	)

	return new Response(JSON.stringify({ error: deleteError?.message ?? null }), {
		headers: { 'Content-Type': 'application/json' },
	})
})


REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM public, anon, authenticated;

DROP POLICY "Anyone can log visit" ON public.visitors;
CREATE POLICY "Anyone can log visit" ON public.visitors FOR INSERT TO anon, authenticated WITH CHECK (length(page) > 0 AND length(page) < 500);

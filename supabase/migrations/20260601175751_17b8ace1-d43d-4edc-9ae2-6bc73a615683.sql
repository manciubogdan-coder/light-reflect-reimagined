-- Fix contact_submissions exposure: only admins can view
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.is_admin_user());

-- Set immutable search_path on all SECURITY DEFINER / public functions
ALTER FUNCTION public.handle_new_message() SET search_path = public;
ALTER FUNCTION public.get_subscription_statistics() SET search_path = public;
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.is_admin_user() SET search_path = public;
ALTER FUNCTION public.has_active_subscription(uuid) SET search_path = public;
ALTER FUNCTION public.verify_payment_and_activate_subscription() SET search_path = public;
ALTER FUNCTION public.update_craftsman_subscription_status(uuid, boolean, timestamp with time zone) SET search_path = public;
ALTER FUNCTION public.update_subscription_status() SET search_path = public;
ALTER FUNCTION public.delete_user(uuid) SET search_path = public;
ALTER FUNCTION public.calculate_distance(double precision, double precision, double precision, double precision) SET search_path = public;
ALTER FUNCTION public.can_access_craftsman_features(uuid) SET search_path = public;
ALTER FUNCTION public.create_initial_subscription() SET search_path = public;
ALTER FUNCTION public.get_craftsman_statistics(uuid, timestamp with time zone, timestamp with time zone) SET search_path = public;
ALTER FUNCTION public.notify_profile_view() SET search_path = public;

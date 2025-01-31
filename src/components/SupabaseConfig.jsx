import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://kxlnategujnlvvyftpvv.supabase.co';
const supabaseBucket = 'https://kxlnategujnlvvyftpvv.supabase.co/storage/v1/s3';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bG5hdGVndWpubHZ2eWZ0cHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzczNTksImV4cCI6MjA1MzY1MzM1OX0.xfKebyx_SahFiYudURHRmZU0peLOmhq5FvyJdHS8i7A';
const supabase = createClient(supabaseUrl, supabaseKey, supabaseBucket);
export default supabase;

export const uploadToSupabase = async (newFileName, file) => {
    try {
        const { data, error } = await supabase.storage
            .from('images')
            .upload(newFileName, file, {
                contentType: file.type,
                upsert: false,
            });
        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
        const publicUrlResponse = supabase.storage
            .from('images')
            .getPublicUrl(data.path);

        return publicUrlResponse.data.publicUrl;
    } catch (error) {
        console.error('Error uploading file to Supabase Storage:', error);
        throw error;
    }
};
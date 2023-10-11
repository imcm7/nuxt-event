
<template> 
<div @click="click">If click here, Nitro request context is not available error will occur.</div>
</template>

<script setup>
    const { signIn } = useAuth();
    const click = () => {
        signIn('credentials', { user: 'user', password: 'password' });
    }
</script>

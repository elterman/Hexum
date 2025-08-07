<script>
    import DemoArrows from './Demo Arrows.svelte';
    import DemoBoard from './Demo Board.svelte';
    import DemoCenter from './Demo Center.svelte';
    import DemoKeyboard from './Demo Keyboard.svelte';
    import Hand from './Hand.svelte';
</script>

<div class="demo">
    <DemoBoard />
    <DemoCenter />
    <Hand/>
    <DemoKeyboard/>
    <DemoArrows />
</div>

<style>
    .demo {
        place-self: center;
        margin-right: 10px;
        display: grid;
        color: black;
    }
</style>

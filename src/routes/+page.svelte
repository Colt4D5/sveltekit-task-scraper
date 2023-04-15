<script>
  import Task from '$lib/components/Task.svelte'
  let loading = false

  $: myTasks = []
  let name = ''
  let showWC = true
  let showWH = false

  const refreshTasks = async (e) => {
    myTasks = []
    const urlParams = new URLSearchParams(window.location.search);
    const un = urlParams.get('un');
    const pw = urlParams.get('pw');
    const nm = urlParams.get('name');
    name = nm

    if (!un || !pw) {
      return alert('You must pass a username (un) and password (pw) in the url params.')
    }
    
    loading = true
    const res = await fetch(`/api/tasks?un=${un}&pw=${pw}${nm ? '&name=' + nm : ''}`)
    const tasks = await res.json()
    loading = false
    myTasks = tasks
  }
</script>


<div id="task-wrapper">
  <div id="settings">
    <label for="wc">
      <input type="checkbox" name="wc" id="wc" bind:checked={showWC} /> Show WCs?
    </label>
    <label for="wh">
      <input type="checkbox" name="wh" id="wh" bind:checked={showWH}/> Show WHs?
    </label>
    <button id="refresh" on:click={refreshTasks}>Refresh</button>
  </div>

  {#if loading}
    <div id="loader-wrapper">
      <div id="loader"></div>
    </div>
  {:else if myTasks.length === 0}
    <div id="empty-tasks">Currently no tasks... Try pressing "Refresh"</div>
  {:else if !loading}
    {#each myTasks as date}
      <div class="date-header"><h1>{date.date}</h1></div>
      <div class="flex">
        {#each date.tasks as task}
          {#if (showWC && task.subtitle.includes('WC') && !task.subtitle.includes('WH')) || (showWH && task.subtitle.includes('WH') && !task.subtitle.includes('WC'))}
            <Task {task} {name} />
          {/if}
        {/each}
      </div>
    {/each}
  {/if}

</div>

<style>
  #empty-tasks {
    text-align: center;
    padding-block: 8rem;
    font-size: clamp(1.25rem, 4vw, 2rem);
    color: #ccc;
  }
  .flex {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 0.5rem;
    flex-wrap: wrap;
    gap: 12px;
    margin: 2rem 0;
  }
  @media (min-width: 40em) {
    .flex {
      padding: 0 3rem;
    }
  }
  .date-header {
    background-color: var(--clr-primary);
    padding: 1.5rem 3rem;
    box-shadow: -12px -12px 12px rgb(255 255 255 / 0.5),
                12px 12px 16px rgb(70 70 70 / 0.15),
                inset 8px 8px 15px rgb(255 255 255 / 0.5),
                inset -6px -6px 15px rgb(70 70 70 / 0.15);
  }
  
  .date-header > h1 {
    font-size: clamp(1.25rem, 4vw, 2rem);
    text-align: center;
    color: var(--text-header);
  }
  @media (min-width: 40em) {
    .date-header > h1 {
      text-align: left;
    }
  }
  
  
  
  #settings {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #ddd;
    text-align: center;
    padding-block: 1rem;
    box-shadow: 0 -8px 8px rgb(0 0 0 / 0.15);
  }
  @media (min-width: 40em) {
    #settings {
      position:  absolute;
      top:  0.5rem;
      bottom: auto;
      right:  0.5rem;
      left: auto;
      width: auto;
      padding: 0;
      background-color: transparent;
      text-align: unset;
      box-shadow: none;
    }
  }
  button#refresh {
    padding: 1rem 1.5rem;
    border-radius: 30px;
    overflow: hidden;
    cursor:  pointer;
  }
  @media (min-width: 40em) {
    button#refresh {
      padding:  1.5rem 2.5rem;
      border-radius: 60px;
      box-shadow: -15px -15px 20px rgb(255 255 255 / 0.75),
                  10px 10px 15px rgb(70 70 70 / 0.15),
                  inset -8px -8px 12px rgb(255 255 255 / 0.5),
                  inset 8px 8px 12px rgb(70 70 70 / 0.15);
    }
  }
  #settings label {
    margin-right: 1rem;
    cursor: pointer;
  }   
  
  #loader {
    width: 40px;
    height: 40px;
    margin: 4rem auto;
    border-radius: 50%;
    border: 6px solid #fff;
    border-bottom: 6px solid #9caf88;
    animation: load 1s linear infinite;
  }
  @keyframes load {
    0% {
      rotate: 0deg;
    }
    100% {
      rotate: 360deg;
    }
  }
</style>

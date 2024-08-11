<script>
  export let task
  export let name

  let isChecked = false
  const toggleChecked = () => isChecked = !isChecked
  const handleClick = e => {
    if (e.target.closest('.checkbox')) {
      toggleChecked()
    } else {
      const content = e.target.closest('.summary').lastElementChild

      content.classList.toggle('active')

      if (content.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px'
      } else {
        content.style.maxHeight = 0 + 'px'
      }
    }
  }

    async function copyToClipboard(e) {
      const text = e.target.closest('.content_inner').innerText
      try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
</script>


<article class="flex-item">
  <div class="details">
    <div class="summary">
      <div class="summary-content" on:click={handleClick} on:keydown={handleClick}>
        <div class="checkbox-cont">
          <div class="checkbox" class:active={isChecked}></div>
        </div>
        <div class="title-div">
          <span class="task-title">{task.title}</span>
          <p class="task-name">{task.subtitle}</p>
        </div>
        <div class="time-div"><p>{@html task.time}</p></div>
      </div>
      <div class="content">
        <div class="content_inner" on:click={copyToClipboard} on:keydown={copyToClipboard}>
          {task.subtitle}<br>
          <br>
          <br>
          <br>
          Thanks!<br>
          <br>
          {#if name}
            - {name}
            <br>
            <br>
          {/if}
          _________________________<br>
          <br>
          {@html task.details.trim()}
        </div>
      </div>
    </div>
  </div>
</article>

<style>
  article.flex-item {
    width: 100%;
    margin-inline: auto;
    margin: 1rem;
    border-radius: 60px;
    overflow: hidden;
    box-shadow: -15px -15px 20px rgb(255 255 255 / 0.75),
                10px 10px 15px rgb(70 70 70 / 0.15),
                inset -8px -8px 12px rgb(255 255 255 / 0.5),
                inset 8px 8px 12px rgb(70 70 70 / 0.15);
  }
  @media (min-width: 40em) {
    article.flex-item {
      width: 45%;
      margin-inline: 1rem;
    }
  }
  /* article.flex-item.wh { display: none; } */
  
  .summary {
    box-shadow: 0 6px 6px rgb(0 0 0 / 0.4);
    cursor: pointer;
  }
  
  .summary-content {
    background-color: #ececec;
    padding: 0.5rem 0;  
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .checkbox-cont {
    width: 125px;
    display: grid;
    place-items: center;
  }
  
  .checkbox {
    width: 20px;
    height: 20px;
    background-color: #dddddd;
    border-radius: 50%;
    box-shadow: -5px -5px 6px rgb(255 255 255 / 0.3),
                5px 5px 6px rgb(70 70 70 / 0.1),
                inset -5px -5px 6px rgb(255 255 255 / 0.3),
                inset 5px 5px 6px rgb(70 70 70 / 0.1);
    transition: background-color 0.3s ease;
  }
  @media (min-width: 40em) {
    .checkbox {
      width: 30px;
      height: 30px;
    }
  }
  
  .checkbox.active {
    background-color: rgb(52 199 89);  
  }
  
  .title-div {
    width: 100%;
  }
  
  .time-div {
    display:grid;
    place-items:center;
    width: 100px;
    height:70px;
    border-left: 1px solid #ccc;
  }
  
  .time-div > p {
    font-size: clamp(1rem, 3vw, 2rem);
    text-align: center;
    font-weight: 500;
  }
  
  .content {
    max-height: 0px;
    transition: max-height 0.4s ease;
    cursor: auto;
  }
  
  .content_inner {
    background-color: rgb(255 255 255 / 0.2);
    padding: 2rem 1.25rem 2.5rem;
    font-size: clamp(1rem, 4vw, 1.4rem);
    box-shadow: inset -6px -6px 12px rgb(255 255 255 / 0.5),
                inset 6px 6px 12px rgb(70 70 70 / 0.15);
  }
  
  .task-title {
    font-size: clamp(1rem, 3vw, 1.5rem);
    font-weight: bold;
  }
  
  .task-name {
    font-size: clamp(0.9rem, 3vw, 1.25rem);
  }
</style>

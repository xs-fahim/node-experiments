var timer = null;
const coverAdvancedControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if(!wp.data.select('genie').sidebar().statisticsData) {
          return <BlockEdit  {...props} />;
        }

        // if(props.name == 'core/paragraph' || props.name == 'core/heading') {
            clearTimeout(timer);
            //const btn = document.querySelector('.getgenie-toolbar-write-btn.stat');
            // if(timer && btn){
            //     btn.disabled = true;
            // }
            

            timer = setTimeout(() => {
              let editedContent = wp.data.select('core/editor').getEditedPostContent();
              wp.data.dispatch('genie').setSidebar({
                  currentPostContent: editedContent
              });
              // if(btn){
              //   btn.disabled = false;
              // }
            }, 2000);
        // }

      return <BlockEdit  {...props} />;
    };
  }, 'withClientIdClassName');
   
  wp.hooks.addFilter(
    'editor.BlockEdit',
    'getgenie/scoreUpdater',
    coverAdvancedControls
  );

